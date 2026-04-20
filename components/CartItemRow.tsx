// ─── Cart Item Row Component ──────────────────────────────────────────────────

import { useCartStore } from '@/store/useCartStore';
import { CartItem } from '@/types';
import { formatCurrency } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface CartItemRowProps {
    item: CartItem;
}

const CartItemRow = memo(({ item }: CartItemRowProps) => {
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const removeFromCart = useCartStore((s) => s.removeFromCart);

    const handleIncrease = useCallback(() => updateQuantity(item.cartId, item.quantity + 1), [item.cartId, item.quantity, updateQuantity]);
    const handleDecrease = useCallback(() => updateQuantity(item.cartId, item.quantity - 1), [item.cartId, item.quantity, updateQuantity]);
    const handleRemove = useCallback(() => removeFromCart(item.cartId), [item.cartId, removeFromCart]);

    return (
        <View
            className="flex-row bg-white rounded-2xl mb-3 overflow-hidden"
            style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}
        >
            {/* Image */}
            <Image
                source={{ uri: item.product.image }}
                className="w-20 h-full"
                resizeMode="cover"
                style={{ minHeight: 90 }}
            />

            {/* Details */}
            <View className="flex-1 p-3">
                <View className="flex-row items-start justify-between">
                    <Text className="font-bold text-gray-800 text-sm flex-1 mr-2" numberOfLines={1}>
                        {item.product.name}
                    </Text>
                    <Pressable onPress={handleRemove} hitSlop={8}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </Pressable>
                </View>

                {/* Size & Add-ons tags */}
                <View className="flex-row flex-wrap gap-1 my-1">
                    <View className="bg-orange-50 rounded-full px-2 py-0.5">
                        <Text className="text-orange-600 text-xs font-medium">{item.selectedSize}</Text>
                    </View>
                    {item.selectedAddOns.map((a) => (
                        <View key={a.id} className="bg-gray-100 rounded-full px-2 py-0.5">
                            <Text className="text-gray-500 text-xs">{a.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Price & Quantity */}
                <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-orange-500 font-bold text-base">{formatCurrency(item.subtotal)}</Text>

                    <View className="flex-row items-center">
                        <Pressable
                            onPress={handleDecrease}
                            className="w-7 h-7 rounded-full bg-gray-100 items-center justify-center"
                        >
                            <Ionicons name="remove" size={14} color="#374151" />
                        </Pressable>
                        <Text className="mx-3 font-bold text-gray-800 w-4 text-center">{item.quantity}</Text>
                        <Pressable
                            onPress={handleIncrease}
                            className="w-7 h-7 rounded-full bg-orange-500 items-center justify-center"
                        >
                            <Ionicons name="add" size={14} color="#fff" />
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
});

CartItemRow.displayName = 'CartItemRow';

export default CartItemRow;
