// src/navigation/types.ts
import type { CatalogItem } from '../services/catalogService';

export type RootStackParamList = {
  Home: undefined;
  Details: { item: CatalogItem };
  Player: { item: CatalogItem };
};
