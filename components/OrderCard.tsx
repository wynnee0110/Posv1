// ─── Order Card Component ─────────────────────────────────────────────────────

import { useOrderStore } from '@/store/useOrderStore';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

interface OrderCardProps {
    order: Order;
}

const OrderCard = memo(({ order }: OrderCardProps) => {
    const { updateOrderStatus } = useOrderStore();

    const handleCancel = useCallback(() => {
        Alert.alert(
            'Cancel Order',
            `Are you sure you want to cancel Order #${order.orderNumber}?`,
            [
                { text: 'No, Keep it', style: 'cancel' },
                { text: 'Yes, Cancel', style: 'destructive', onPress: () => updateOrderStatus(order.id, 'cancelled') }
            ]
        );
    }, [order.id, order.orderNumber, updateOrderStatus]);

    const handleComplete = useCallback(() => {
        Alert.alert(
            'Complete Order',
            `Mark Order #${order.orderNumber} as completed?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', style: 'default', onPress: () => updateOrderStatus(order.id, 'completed') }
            ]
        );
    }, [order.id, order.orderNumber, updateOrderStatus]);

    return (
        <View
            className="bg-white rounded-2xl mb-3 overflow-hidden border border-gray-100"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <View className="bg-orange-100 rounded-full px-3 py-0.5 mr-2">
                            <Text className="text-orange-600 text-xs font-bold">#{order.orderNumber}</Text>
                        </View>
                        {order.status && (
                            <View className={`rounded-full px-2 py-0.5 mr-2 ${order.status === 'completed' ? 'bg-green-100' :
                                order.status === 'cancelled' ? 'bg-red-100' :
                                    'bg-blue-100'
                                }`}>
                                <Text className={`text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed' ? 'text-green-600' :
                                    order.status === 'cancelled' ? 'text-red-700' :
                                        'text-blue-600'
                                    }`}>{order.status}</Text>
                            </View>
                        )}
                        <Text className="text-gray-400 text-xs">{formatDate(order.createdAt)}</Text>
                    </View>
                    <Text className="text-gray-600 text-sm">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </Text>
                </View>
                <View className="items-end">
                    <Text className="font-bold text-gray-800 text-base">{formatCurrency(order.totalPrice)}</Text>
                </View>
            </View>

            {/* Expandable Item List */}
            <View className="px-4 pb-4 bg-white pt-2">
                {order.items.map((item, idx) => (
                    <View key={`${item.cartId}_${idx}`} className="flex-row items-center justify-between py-2">
                        <View className="flex-1 mr-3">
                            <Text className="text-gray-700 text-sm font-medium">{item.product.name}</Text>
                            <Text className="text-gray-400 text-xs">
                                {item.selectedSize}
                                {item.selectedAddOns.length > 0
                                    ? ` · ${item.selectedAddOns.map((a) => a.name).join(', ')}`
                                    : ''}
                            </Text>
                        </View>
                        <Text className="text-gray-500 text-sm">x{item.quantity}</Text>
                        <Text className="text-orange-500 font-semibold text-sm ml-3">
                            {formatCurrency(item.subtotal)}
                        </Text>
                    </View>
                ))}
                <View className="flex-row justify-between pt-3 border-t border-gray-100 mt-1">
                    <Text className="font-bold text-gray-700">Total</Text>
                    <Text className="font-bold text-orange-500 text-base">
                        {formatCurrency(order.totalPrice)}
                    </Text>
                </View>
                {order.status === 'processing' && (
                    <View className="flex-row gap-3 mt-4 pt-3 border-t border-gray-100">
                        <Pressable
                            onPress={handleCancel}
                            className="flex-1 py-3 rounded-xl border border-red-500 items-center justify-center flex-row"
                        >
                            <Ionicons name="close-circle-outline" size={18} color="#ef4444" className="mr-1" />
                            <Text className="text-red-500 font-bold ml-1">Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleComplete}
                            className="flex-1 py-3 rounded-xl bg-green-500 items-center justify-center flex-row"
                            style={{ shadowColor: '#22c55e', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 }}
                        >
                            <Ionicons name="checkmark-circle" size={18} color="#fff" className="mr-1" />
                            <Text className="text-white font-bold ml-1">Complete</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
