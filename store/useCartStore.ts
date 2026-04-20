// ─── Cart Store (Zustand) ────────────────────────────────────────────────────

import { AddOn, CartItem, Product, ProductSize } from '@/types';
import { create } from 'zustand';

interface CartState {
    items: CartItem[];
    addToCart: (product: Product, qty: number, size: ProductSize, addOns: AddOn[]) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, qty: number) => void;
    clearCart: () => void;
    totalPrice: () => number;
    totalItemCount: () => number;
}

function calcSubtotal(product: Product, qty: number, size: ProductSize, addOns: AddOn[]): number {
    let basePrice = product.price ?? 0;
    if (product.hasSizes && product.sizePrices?.[size] !== undefined) {
        basePrice = product.sizePrices[size]!;
    } else {
        const sizeMultiplier = size === 'Small' ? 1 : size === 'Medium' ? 1.2 : 1.5;
        basePrice = basePrice * sizeMultiplier;
    }
    const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    return (basePrice + addOnTotal) * qty;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],

    addToCart: (product, qty, size, addOns) => {
        const cartId = `${product.id}_${Date.now()}`;
        const subtotal = calcSubtotal(product, qty, size, addOns);
        set((state) => ({
            items: [...state.items, { cartId, product, quantity: qty, selectedSize: size, selectedAddOns: addOns, subtotal }],
        }));
    },

    removeFromCart: (cartId) => {
        set((state) => ({ items: state.items.filter((i) => i.cartId !== cartId) }));
    },

    updateQuantity: (cartId, qty) => {
        if (qty <= 0) {
            get().removeFromCart(cartId);
            return;
        }
        set((state) => ({
            items: state.items.map((i) => {
                if (i.cartId !== cartId) return i;
                const subtotal = calcSubtotal(i.product, qty, i.selectedSize, i.selectedAddOns);
                return { ...i, quantity: qty, subtotal };
            }),
        }));
    },

    clearCart: () => set({ items: [] }),

    totalPrice: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),

    totalItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
