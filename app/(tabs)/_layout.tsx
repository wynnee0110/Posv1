// ─── Tab Navigation Layout ────────────────────────────────────────────────────
// 4 tabs: Home, Cart (with badge), Orders, Manage

import { useCartStore } from '@/store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

/** Orange badge showing cart item count */
function CartBadge() {
  const totalCount = useCartStore((s) => s.totalItemCount());
  if (totalCount === 0) return null;
  return (
    <View
      style={{
        position: 'absolute',
        top: -4,
        right: -8,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
        {totalCount > 99 ? '99+' : totalCount}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f97316', // orange-500
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#F3F4F6',
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 12,
          bottom: 1,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* Tab 1: Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 2: Cart (with badge) */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="cart" size={size} color={color} />
              <CartBadge />
            </View>
          ),
        }}
      />

      {/* Tab 3: Orders */}
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 4: Manage */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Manage',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
