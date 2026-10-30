export type MviConceptId =
  | 'udf_flow'
  | 'state_definition'
  | 'action_interface'
  | 'event_channel'
  | 'viewmodel_onaction'
  | 'screen_root_content'
  | 'observe_as_events'
  | 'uitext_pattern';

export interface MviConcept {
  id: MviConceptId;
  name: string;
  badge: string;
  summary: string;
  description: string;
  architectureRule: string;
  kotlinCode: string;
  dos: string[];
  donts: string[];
}

export interface MviActionItem {
  id: string;
  timestamp: string;
  name: string;
  payload?: string;
}

export interface MviEventItem {
  id: string;
  timestamp: string;
  name: string;
  payload?: string;
  delivered: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  isFavorite: boolean;
}

export interface DemoScreenState {
  searchQuery: string;
  products: ProductItem[];
  cartCount: number;
  isLoading: boolean;
  selectedFilter: 'all' | 'favorites' | 'in_stock';
  isDeviceRotated: boolean;
}
