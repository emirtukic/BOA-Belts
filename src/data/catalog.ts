import { womensBelts } from './womensBelts';
import { mensBelts } from './mensBelts';
import { bags } from './bags';
import { wallets } from './wallets';
import { accessories } from './accessories';

export type CatalogCategory =
  | 'womensBelts'
  | 'mensBelts'
  | 'bags'
  | 'wallets'
  | 'accessories';

export type CatalogProduct = {
  id: string;
  name: string;
  price: string;
  description: string;
  colors: {
    label: string;
    image: string;
    preview?: string;
    swatch?: string;
  }[];
  category: CatalogCategory;
  listHref: string;
};

const womensCatalog: CatalogProduct[] = womensBelts.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description ?? '',
  colors: product.colors,
  category: 'womensBelts',
  listHref: '/kaisevi#womens-belts',
}));

const mensCatalog: CatalogProduct[] = mensBelts.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description ?? '',
  colors: product.colors,
  category: 'mensBelts',
  listHref: '/kaisevi#mens-belts',
}));

const bagsCatalog: CatalogProduct[] = bags.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description ?? '',
  colors: product.colors,
  category: 'bags',
  listHref: '/torbe',
}));

const walletsCatalog: CatalogProduct[] = wallets.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description ?? '',
  colors: product.colors,
  category: 'wallets',
  listHref: '/novcanici',
}));

const accessoriesCatalog: CatalogProduct[] = accessories.map((product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  description: product.description ?? '',
  colors: product.colors,
  category: 'accessories',
  listHref: '/dodaci',
}));

export const catalogProducts: CatalogProduct[] = [
  ...womensCatalog,
  ...mensCatalog,
  ...bagsCatalog,
  ...walletsCatalog,
  ...accessoriesCatalog,
];

export const catalogProductMap: Record<string, CatalogProduct> = Object.fromEntries(
  catalogProducts.map((product) => [product.id, product]),
);
