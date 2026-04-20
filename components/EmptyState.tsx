// ─── Empty State Component ────────────────────────────────────────────────────

import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Text, View } from 'react-native';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

const EmptyState = memo(({ icon, title, subtitle }: EmptyStateProps) => (
    <View className="flex-1 items-center justify-center py-20 px-8">
        <View className="w-20 h-20 rounded-full bg-orange-50 items-center justify-center mb-4">
            <Ionicons name={icon} size={36} color="#f97316" />
        </View>
        <Text className="text-gray-700 text-lg font-bold text-center mb-2">{title}</Text>
        {subtitle ? (
            <Text className="text-gray-400 text-sm text-center leading-5">{subtitle}</Text>
        ) : null}
    </View>
));

EmptyState.displayName = 'EmptyState';

export default EmptyState;
