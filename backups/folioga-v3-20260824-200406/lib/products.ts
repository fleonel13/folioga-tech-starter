export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  condition: "Neuf" | "Excellent" | "Très bon" | "Bon";
  stock: number;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "iphone-13",
    name: "iPhone 13 128 Go",
    category: "Smartphones",
    description:
      "iPhone reconditionné, testé et contrôlé par nos techniciens.",
    price: 429,
    oldPrice: 499,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviews: 126,
    condition: "Excellent",
    stock: 8,
    badge: "Best-seller",
  },
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2",
    category: "Ordinateurs",
    description:
      "MacBook Air M2 reconditionné, idéal pour le travail et les études.",
    price: 899,
    oldPrice: 1099,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    rating: 4.9,
    reviews: 94,
    condition: "Excellent",
    stock: 4,
    badge: "Premium",
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "Tablettes",
    description:
      "Tablette polyvalente avec écran haute qualité et excellente autonomie.",
    price: 399,
    oldPrice: 469,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    reviews: 82,
    condition: "Très bon",
    stock: 7,
  },
  {
    id: "galaxy-s23",
    name: "Samsung Galaxy S23",
    category: "Smartphones",
    description:
      "Smartphone Android haut de gamme entièrement contrôlé.",
    price: 489,
    oldPrice: 599,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
    rating: 4.8,
    reviews: 73,
    condition: "Excellent",
    stock: 5,
    badge: "Top vente",
  },
  {
    id: "thinkpad-t14",
    name: "Lenovo ThinkPad T14",
    category: "Ordinateurs",
    description:
      "Ordinateur professionnel robuste et performant.",
    price: 579,
    oldPrice: 699,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80",
    rating: 4.6,
    reviews: 51,
    condition: "Très bon",
    stock: 6,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "Audio",
    description:
      "Écouteurs sans fil avec réduction active du bruit.",
    price: 179,
    oldPrice: 249,
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80",
    rating: 4.7,
    reviews: 118,
    condition: "Excellent",
    stock: 12,
    badge: "Populaire",
  },
];

export const categories = [
  "Tous",
  "Smartphones",
  "Ordinateurs",
  "Tablettes",
  "Audio",
];
