// ─── Product Card Component ───────────────────────────────────────────────────

import { Product } from '@/types';
import { formatCurrency } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface ProductCardProps {
    product: Product;
    onPress: (product: Product) => void;
}

const ProductCard = memo(({ product, onPress }: ProductCardProps) => {
    const handlePress = useCallback(() => onPress(product), [onPress, product]);

    return (
        <Pressable
            onPress={handlePress}
            className="flex-1 m-2 bg-white rounded-3xl overflow-hidden"
            style={{
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 3,
            }}
        >
            {/* Product Image */}
            <Image
                source={{ uri: product.image }}
                className="w-full h-32"
                resizeMode="cover"
            // progressiveRenderingEnabled for Android performance
            />

            {/* Card Body */}
            <View className="p-3">
                <Text className="font-bold text-gray-800 text-sm mb-0.5" numberOfLines={2}>
                    {product.name}
                </Text>
                <Text className="text-orange-500 font-semibold text-sm mb-2">
                    {formatCurrency(product.price)}
                </Text>

                {/* Add to Cart Button */}
                <Pressable
                    onPress={handlePress}
                    className="bg-orange-500 flex-row items-center justify-center py-2 rounded-xl"
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                    <Ionicons name="add" size={16} color="#fff" />
                    <Text className="text-white font-semibold text-xs ml-1">Add to Cart</Text>
                </Pressable>
            </View>
        </Pressable>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
