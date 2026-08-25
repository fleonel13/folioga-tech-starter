"use client";

import { Product } from "./products";

export type CartItem = Product & {
  quantity: number;
};

const KEY = "folioga-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((item) => item.id !== id));
}

export function updateQuantity(id: string, quantity: number) {
  const cart = getCart();

  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity = Math.max(1, quantity);

  saveCart(cart);
}

export function cartCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function cartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}
