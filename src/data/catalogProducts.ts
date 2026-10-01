export type ProductColor = {
  name: string;
  hex: string;
};

export const catalogProductColors: ProductColor[] = [
  { name: "Blanco", hex: "#FFFFFF" },
  { name: "Rosa", hex: "#FBC4D7" },
  { name: "Lila", hex: "#C7B2D6" },
];

export const catalogKidsSizes = ["6", "8", "10", "12", "14"] as const;

export type CatalogProduct = {
  id: string;
  image: string;
  title: string;
  description: string;
  colors: ProductColor[];
};
