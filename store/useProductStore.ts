// ─── Product Store (Zustand + AsyncStorage persistence) ───────────────────────

import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/utils/sampleData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = '@pos_products';

interface ProductState {
    products: Product[];
    isLoaded: boolean;
    loadProducts: () => Promise<void>;
    addProduct: (product: Product) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

async function persist(products: Product[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoaded: false,

    /** Load from AsyncStorage; seed with sample data on first launch */
    loadProducts: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                set({ products: JSON.parse(stored), isLoaded: true });
            } else {
                set({ products: SAMPLE_PRODUCTS, isLoaded: true });
                await persist(SAMPLE_PRODUCTS);
            }
        } catch {
            set({ products: SAMPLE_PRODUCTS, isLoaded: true });
        }
    },

    addProduct: async (product) => {
        const next = [...get().products, product];
        set({ products: next });
        await persist(next);
    },

    updateProduct: async (product) => {
        const next = get().products.map((p) => (p.id === product.id ? product : p));
        set({ products: next });
        await persist(next);
    },

    deleteProduct: async (id) => {
        const next = get().products.filter((p) => p.id !== id);
        set({ products: next });
        await persist(next);
    },
}));
