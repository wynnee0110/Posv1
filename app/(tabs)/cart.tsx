// ─── Cart Screen ──────────────────────────────────────────────────────────────

import CartItemRow from '@/components/CartItemRow';
import EmptyState from '@/components/EmptyState';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { CartItem } from '@/types';
import { formatCurrency } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
    Alert,
    FlatList, Pressable,
    Text,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CartScreen() {
    const insets = useSafeAreaInsets();
    const items = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);
    const totalPrice = useCartStore((s) => s.totalPrice);
    const addOrder = useOrderStore((s) => s.addOrder);

    const handleClearCart = useCallback(() => {
        Alert.alert('Clear Cart', 'Remove all items from your cart?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
        ]);
    }, [clearCart]);

    const handleCheckout = useCallback(async () => {
        if (items.length === 0) return;
        const total = totalPrice();
        Alert.alert(
            'Confirm Checkout',
            `Total: ${formatCurrency(total)}\n\nProceed with this order?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Checkout',
                    onPress: async () => {
                        await addOrder(items, total);
                        clearCart();
                        router.push('/(tabs)/orders');
                    },
                },
            ],
        );
    }, [items, totalPrice, addOrder, clearCart]);

    const renderItem = useCallback(
        ({ item }: { item: CartItem }) => <CartItemRow item={item} />,
        [],
    );

    const keyExtractor = useCallback((item: CartItem) => item.cartId, []);

    return (
        <View className="flex-1 bg-orange-50">
            {/* ── Header ── */}
            <View
                className="bg-white pb-4"
                style={{ paddingTop: insets.top + 12, paddingHorizontal: 16 }}
            >
                <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold text-gray-800">Your Cart</Text>
                    {items.length > 0 && (
                        <Pressable onPress={handleClearCart}>
                            <Text className="text-red-400 font-medium text-sm">Clear All</Text>
                        </Pressable>
                    )}
                </View>
                {items.length > 0 && (
                    <Text className="text-gray-400 text-sm mt-1">
                        {items.length} item{items.length !== 1 ? 's' : ''}
                    </Text>
                )}
            </View>

            {/* ── Cart Items ── */}
            <FlatList
                data={items}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 120 + insets.bottom,
                    flexGrow: 1,
                }}
                initialNumToRender={10}
                windowSize={5}
                ListEmptyComponent={
                    <EmptyState
                        icon="cart-outline"
                        title="Your cart is empty"
                        subtitle="Browse the menu and add your favourite Filipino dishes!"
                    />
                }
            />

            {/* ── Checkout Footer ── */}
            {items.length > 0 && (
                <View
                    className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 border-t border-gray-100"
                    style={{ paddingBottom: insets.bottom + 16 }}
                >
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-gray-500 font-medium">Subtotal</Text>
                        <Text className="font-bold text-gray-800 text-lg">{formatCurrency(totalPrice())}</Text>
                    </View>
                    <Pressable
                        onPress={handleCheckout}
                        className="bg-orange-500 py-4 rounded-2xl flex-row items-center justify-center"
                        style={{ shadowColor: '#f97316', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 }}
                    >
                        <Ionicons name="receipt-outline" size={20} color="#fff" />
                        <Text className="text-white font-bold text-base ml-2">
                            Checkout · {formatCurrency(totalPrice())}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
