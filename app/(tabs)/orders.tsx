// ─── Orders Screen ─────────────────────────────────────────────────────────

import EmptyState from '@/components/EmptyState';
import OrderCard from '@/components/OrderCard';
import { useOrderStore } from '@/store/useOrderStore';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/utils/dateUtils';
import { exportOrdersAsCSV, exportOrdersAsJSON } from '@/utils/exportUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList, Pressable,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS: { label: string; value: OrderStatus }[] = [
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersScreen() {
    const insets = useSafeAreaInsets();
    const { orders, isLoaded, loadOrders } = useOrderStore();
    const [activeFilter, setActiveFilter] = useState<OrderStatus>('processing');
    const [exporting, setExporting] = useState(false);

    useEffect(() => { loadOrders(); }, []);

    // Apply selected status filter
    const filteredOrders = useMemo(() => {
        return orders.filter(o => o.status === activeFilter);
    }, [orders, activeFilter]);

    // Summary calculations
    const totalRevenue = useMemo(
        () => filteredOrders.reduce((sum, o) => sum + o.totalPrice, 0),
        [filteredOrders],
    );

    const handleExport = useCallback(() => {
        if (filteredOrders.length === 0) {
            Alert.alert('No Orders', 'No orders to export in the selected range.');
            return;
        }
        Alert.alert('Export Orders', 'Choose export format:', [
            {
                text: 'CSV',
                onPress: async () => {
                    setExporting(true);
                    try {
                        await exportOrdersAsCSV(orders, 'custom');
                    } catch (e: any) {
                        Alert.alert('Export Error', e.message);
                    } finally {
                        setExporting(false);
                    }
                },
            },
            {
                text: 'JSON',
                onPress: async () => {
                    setExporting(true);
                    try {
                        await exportOrdersAsJSON(orders, 'custom');
                    } catch (e: any) {
                        Alert.alert('Export Error', e.message);
                    } finally {
                        setExporting(false);
                    }
                },
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    }, [filteredOrders, orders, activeFilter]);

    const renderItem = useCallback(({ item }: { item: Order }) => <OrderCard order={item} />, []);
    const keyExtractor = useCallback((item: Order) => item.id, []);

    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center bg-orange-50">
                <ActivityIndicator size="large" color="#f97316" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-orange-50">
            {/* ── Header ── */}
            <View
                className="bg-white pb-3"
                style={{ paddingTop: insets.top + 12, paddingHorizontal: 16 }}
            >
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-gray-800">Order Tickets</Text>
                    <Pressable
                        onPress={handleExport}
                        className="flex-row items-center bg-orange-50 px-3 py-2 rounded-xl"
                        disabled={exporting}
                    >
                        {exporting
                            ? <ActivityIndicator size="small" color="#f97316" />
                            : <Ionicons name="download-outline" size={16} color="#f97316" />}
                        <Text className="text-orange-500 font-semibold text-sm ml-1">Export</Text>
                    </Pressable>
                </View>

                {/* Filter Pills */}
                <View className="flex-row gap-2">
                    {FILTERS.map((f) => (
                        <Pressable
                            key={f.value}
                            onPress={() => setActiveFilter(f.value)}
                            className={`flex-1 py-2 rounded-xl items-center ${activeFilter === f.value ? 'bg-orange-500' : 'bg-gray-100'
                                }`}
                        >
                            <Text className={`text-xs font-semibold ${activeFilter === f.value ? 'text-white' : 'text-gray-600'}`}>
                                {f.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* ── Stats Bar ── */}
            {filteredOrders.length > 0 && (
                <View className="flex-row bg-white mx-4 mt-3 rounded-2xl overflow-hidden"
                    style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
                    <View className="flex-1 items-center py-4 border-r border-gray-100">
                        <Text className="text-2xl font-bold text-orange-500">{filteredOrders.length}</Text>
                        <Text className="text-gray-400 text-xs mt-0.5">Orders</Text>
                    </View>
                    <View className="flex-1 items-center py-4">
                        <Text className="text-2xl font-bold text-orange-500">{formatCurrency(totalRevenue)}</Text>
                        <Text className="text-gray-400 text-xs mt-0.5">Revenue</Text>
                    </View>
                </View>
            )}

            {/* ── Order List ── */}
            <FlatList
                data={filteredOrders}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: insets.bottom + 16,
                    flexGrow: 1,
                }}
                initialNumToRender={10}
                windowSize={5}
                ListEmptyComponent={
                    <EmptyState
                        icon="receipt-outline"
                        title={`No ${activeFilter} orders`}
                        subtitle="Check other tabs or place new orders."
                    />
                }
            />
        </View>
    );
}
