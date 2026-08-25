export type ProductCondition =
  | 'Reconditionné'
  | 'Excellent'
  | 'Très bon'
  | 'Bon';

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  condition: ProductCondition;
  stock: number;
  description: string;
  features: string[];
  brand: string;
};

export const products: Product[] = [
  {
    id: 'iphone-13-128',
    name: 'iPhone 13 128 Go',
    slug: 'iphone-13-128',
    category: 'Smartphones',
    price: 399,
    oldPrice: 499,
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.8,
    reviews: 124,
    condition: 'Excellent',
    stock: 8,
    description:
      'iPhone 13 reconditionné et contrôlé par nos techniciens. Une excellente solution pour profiter des performances Apple à prix réduit.',
    features: [
      'Écran Super Retina XDR',
      '128 Go de stockage',
      'Double appareil photo',
      'Batterie contrôlée',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  },
  {
    id: 'macbook-air-m1',
    name: 'MacBook Air M1',
    slug: 'macbook-air-m1',
    category: 'Ordinateurs',
    price: 699,
    oldPrice: 899,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.9,
    reviews: 89,
    condition: 'Très bon',
    stock: 5,
    description:
      'MacBook Air équipé de la puce Apple M1, idéal pour travailler, étudier et créer au quotidien.',
    features: [
      'Puce Apple M1',
      '8 Go RAM',
      '256 Go SSD',
      'Écran Retina',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  },
  {
    id: 'galaxy-s22',
    name: 'Samsung Galaxy S22',
    slug: 'galaxy-s22',
    category: 'Smartphones',
    price: 329,
    oldPrice: 449,
    image:
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.7,
    reviews: 76,
    condition: 'Très bon',
    stock: 12,
    description:
      'Smartphone Samsung compact, puissant et parfaitement adapté à un usage quotidien.',
    features: [
      'Écran AMOLED',
      '128 Go',
      'Appareil photo haute résolution',
      '5G',
      'Batterie contrôlée'
    ],
    brand: 'Samsung'
  },
  {
    id: 'ipad-10',
    name: 'iPad 10e génération',
    slug: 'ipad-10',
    category: 'Tablettes',
    price: 429,
    oldPrice: 529,
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.8,
    reviews: 54,
    condition: 'Excellent',
    stock: 6,
    description:
      'iPad moderne et polyvalent pour le travail, les études, le divertissement et la création.',
    features: [
      'Écran Liquid Retina',
      '64 Go',
      'USB-C',
      'Wi-Fi',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  },
  {
    id: 'thinkpad-t14',
    name: 'Lenovo ThinkPad T14',
    slug: 'thinkpad-t14',
    category: 'Ordinateurs',
    price: 549,
    oldPrice: 749,
    image:
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.6,
    reviews: 41,
    condition: 'Bon',
    stock: 4,
    description:
      'Ordinateur professionnel robuste, idéal pour les entreprises, développeurs et professionnels mobiles.',
    features: [
      'Écran 14 pouces',
      'SSD',
      'Clavier professionnel',
      'Windows compatible',
      'Contrôle technique'
    ],
    brand: 'Lenovo'
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro',
    slug: 'airpods-pro',
    category: 'Audio',
    price: 159,
    oldPrice: 249,
    image:
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=85',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1200&q=85'
    ],
    rating: 4.7,
    reviews: 137,
    condition: 'Excellent',
    stock: 15,
    description:
      'Écouteurs sans fil avec réduction active du bruit et boîtier de charge.',
    features: [
      'Réduction de bruit',
      'Bluetooth',
      'Boîtier de charge',
      'Résistance à la transpiration',
      'Garantie Folioga'
    ],
    brand: 'Apple'
  }
];

export function getProduct(id: string) {
  return products.find(
    (product) => product.id === id || product.slug === id
  );
}
