// ─── Order Store (Zustand + AsyncStorage persistence) ─────────────────────────

import { CartItem, Order } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = '@pos_orders';

interface OrderState {
    orders: Order[];
    isLoaded: boolean;
    loadOrders: () => Promise<void>;
    addOrder: (items: CartItem[], totalPrice: number) => Promise<Order>;
    updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
    clearOrders: () => Promise<void>;
}

async function persist(orders: Order[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export const useOrderStore = create<OrderState>((set, get) => ({
    orders: [],
    isLoaded: false,

    loadOrders: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            set({ orders: stored ? JSON.parse(stored) : [], isLoaded: true });
        } catch {
            set({ isLoaded: true });
        }
    },

    addOrder: async (items, totalPrice) => {
        const existing = get().orders;
        const orderNumber = existing.length + 1;
        const order: Order = {
            id: `order_${Date.now()}`,
            items,
            totalPrice,
            createdAt: new Date().toISOString(),
            orderNumber,
            status: 'processing',
        };
        const next = [order, ...existing]; // newest first
        set({ orders: next });
        await persist(next);
        return order;
    },

    updateOrderStatus: async (orderId, status) => {
        const existing = get().orders;
        const next = existing.map(o => o.id === orderId ? { ...o, status } : o);
        set({ orders: next });
        await persist(next);
    },

    clearOrders: async () => {
        set({ orders: [] });
        await AsyncStorage.removeItem(STORAGE_KEY);
    },
}));
