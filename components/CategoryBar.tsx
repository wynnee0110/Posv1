// ─── Category Bar Component ───────────────────────────────────────────────────

import { ProductCategory } from '@/types';
import React, { memo, useCallback } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

const CATEGORIES: ProductCategory[] = ['All', 'Main Foods', 'Desserts', 'Drinks', 'Add-ons'];

interface CategoryBarProps {
    active: ProductCategory;
    onSelect: (category: ProductCategory) => void;
}

const CategoryPill = memo(({
    label, isActive, onPress,
}: { label: string; isActive: boolean; onPress: () => void }) => (
    <Pressable
        onPress={onPress}
        className={`px-5 py-2 rounded-full mr-3 ${isActive ? 'bg-orange-500' : 'bg-white'}`}
        style={isActive
            ? { shadowColor: '#f97316', shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 }
            : { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
    >
        <Text className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
            {label}
        </Text>
    </Pressable>
));

CategoryPill.displayName = 'CategoryPill';

const CategoryBar = memo(({ active, onSelect }: CategoryBarProps) => {
    const handleSelect = useCallback((cat: ProductCategory) => () => onSelect(cat), [onSelect]);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
            {CATEGORIES.map((cat) => (
                <CategoryPill
                    key={cat}
                    label={cat}
                    isActive={active === cat}
                    onPress={handleSelect(cat)}
                />
            ))}
        </ScrollView>
    );
});

CategoryBar.displayName = 'CategoryBar';

export default CategoryBar;
