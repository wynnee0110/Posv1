// ─── Core POS Types ──────────────────────────────────────────────────────────

export type ProductCategory = 'All' | 'Main Foods' | 'Desserts' | 'Drinks' | 'Add-ons';

export type ProductSize = 'Small' | 'Medium' | 'Large';

export interface AddOn {
    id: string;
    name: string;
    price: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;           // base price in PHP
    category: ProductCategory;
    image: string;           // URL string or local require path stored as string key
    imageSource?: any;       // runtime image source (uri or require)
    description?: string;
    hasSizes?: boolean;
    sizePrices?: {
        Small?: number;
        Medium?: number;
        Large?: number;
    };
    availableSizes?: ProductSize[];
    availableAddOns?: AddOn[];
}

export interface CartItem {
    cartId: string;          // unique per cart entry (product can be added multiple times)
    product: Product;
    quantity: number;
    selectedSize: ProductSize;
    selectedAddOns: AddOn[];
    subtotal: number;
}
export const ORDER_STATUS = {
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface Order {
    id: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: string;       // ISO timestamp
    orderNumber: number;
    status: OrderStatus;
}

export type DateRangeFilter = '7days' | '30days' | 'custom';

export interface CustomDateRange {
    from: Date;
    to: Date;
}
