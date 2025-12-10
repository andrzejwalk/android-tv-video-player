import catalogData from '../data/catalog.json';

type CatalogItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  streamUrl: string;
  duration: number;
};

type CatalogData = {
  items: CatalogItem[];
};

/**
 * Fetches catalog data. Currently returns static JSON data.
 * In production, this would make an API call.
 * Simulates async behavior to match real-world patterns.
 */
export async function fetchCatalog(): Promise<CatalogItem[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 4000));

  const catalog = catalogData as CatalogData;
  return catalog.items ?? [];
}

export type { CatalogItem };
