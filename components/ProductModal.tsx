// ─── Product Modal Component ──────────────────────────────────────────────────
// Bottom-sheet style modal for configuring quantity, size, and add-ons

import { useCartStore } from '@/store/useCartStore';
import { AddOn, Product, ProductSize } from '@/types';
import { formatCurrency } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useState } from 'react';
import {
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';

interface ProductModalProps {
    product: Product | null;
    visible: boolean;
    onClose: () => void;
}

const SIZES: ProductSize[] = ['Small', 'Medium', 'Large'];
const SIZE_MULTIPLIERS: Record<ProductSize, number> = {
    Small: 1,
    Medium: 1.2,
    Large: 1.5,
};
const SIZE_LABELS: Record<ProductSize, string> = {
    Small: 'S',
    Medium: 'M',
    Large: 'L',
};

const ProductModal = memo(({ product, visible, onClose }: ProductModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<ProductSize>('Medium');
    const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
    const addToCart = useCartStore((s) => s.addToCart);

    const handleClose = useCallback(() => {
        // Reset state
        setQuantity(1);
        setSelectedSize('Medium');
        setSelectedAddOns([]);
        onClose();
    }, [onClose]);

    const toggleAddOn = useCallback((addOn: AddOn) => {
        setSelectedAddOns((prev) => {
            const exists = prev.find((a) => a.id === addOn.id);
            return exists ? prev.filter((a) => a.id !== addOn.id) : [...prev, addOn];
        });
    }, []);

    const handleAddToCart = useCallback(() => {
        if (!product) return;
        addToCart(product, quantity, selectedSize, selectedAddOns);
        handleClose();
    }, [product, quantity, selectedSize, selectedAddOns, addToCart, handleClose]);

    if (!product) return null;

    const availableSizes = product.availableSizes ?? SIZES;
    const addOns = product.availableAddOns ?? [];

    const basePrice = (product.hasSizes && product.sizePrices?.[selectedSize])
        ? product.sizePrices[selectedSize]!
        : (product.price * SIZE_MULTIPLIERS[selectedSize]); // fallback

    const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const total = (basePrice + addOnTotal) * quantity;

    return (
        <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
            <Pressable className="flex-1 bg-black/50" onPress={handleClose} />

            <View
                className="bg-white rounded-t-3xl"
                style={{ maxHeight: '85%', position: 'absolute', bottom: 0, left: 0, right: 0 }}
            >
                <SafeAreaView>
                    {/* Handle */}
                    <View className="items-center pt-3 pb-1">
                        <View className="w-10 h-1 rounded-full bg-gray-300" />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Product Image */}
                        <Image
                            source={{ uri: product.image }}
                            className="w-full h-48"
                            resizeMode="cover"
                        />

                        <View className="p-5">
                            {/* Header */}
                            <View className="flex-row justify-between items-start mb-1">
                                <Text className="text-xl font-bold text-gray-800 flex-1 mr-4">{product.name}</Text>
                                <Pressable onPress={handleClose} hitSlop={8}>
                                    <Ionicons name="close-circle" size={26} color="#9CA3AF" />
                                </Pressable>
                            </View>
                            {product.description ? (
                                <Text className="text-gray-500 text-sm mb-4">{product.description}</Text>
                            ) : null}

                            {/* ── Size Selector ── */}
                            {availableSizes.length > 0 && (
                                <View className="mb-4">
                                    <Text className="font-bold text-gray-700 mb-2">Size</Text>
                                    <View className="flex-row gap-3">
                                        {availableSizes.map((size) => (
                                            <Pressable
                                                key={size}
                                                onPress={() => setSelectedSize(size)}
                                                className={`flex-1 py-3 rounded-2xl items-center border-2 ${selectedSize === size
                                                    ? 'bg-orange-500 border-orange-500'
                                                    : 'bg-white border-gray-200'
                                                    }`}
                                            >
                                                <Text className={`font-bold text-sm ${selectedSize === size ? 'text-white' : 'text-gray-600'}`}>
                                                    {SIZE_LABELS[size]}
                                                </Text>
                                                <Text className={`text-xs mt-0.5 ${selectedSize === size ? 'text-orange-100' : 'text-gray-400'}`}>
                                                    {size}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* ── Add-Ons ── */}
                            {addOns.length > 0 && (
                                <View className="mb-4">
                                    <Text className="font-bold text-gray-700 mb-2">Add-ons</Text>
                                    {addOns.map((addOn) => {
                                        const isSelected = selectedAddOns.some((a) => a.id === addOn.id);
                                        return (
                                            <Pressable
                                                key={addOn.id}
                                                onPress={() => toggleAddOn(addOn)}
                                                className="flex-row items-center justify-between py-3 border-b border-gray-100"
                                            >
                                                <View className="flex-row items-center flex-1">
                                                    <View
                                                        className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
                                                    </View>
                                                    <Text className="text-gray-700 text-sm">{addOn.name}</Text>
                                                </View>
                                                <Text className="text-orange-500 font-semibold text-sm">
                                                    +{formatCurrency(addOn.price)}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}

                            {/* ── Quantity Stepper ── */}
                            <View className="flex-row items-center justify-between mb-5">
                                <Text className="font-bold text-gray-700">Quantity</Text>
                                <View className="flex-row items-center">
                                    <Pressable
                                        onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
                                    >
                                        <Ionicons name="remove" size={18} color="#374151" />
                                    </Pressable>
                                    <Text className="mx-4 font-bold text-gray-800 text-lg w-6 text-center">
                                        {quantity}
                                    </Text>
                                    <Pressable
                                        onPress={() => setQuantity((q) => q + 1)}
                                        className="w-9 h-9 rounded-full bg-orange-500 items-center justify-center"
                                    >
                                        <Ionicons name="add" size={18} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>

                            {/* ── Add to Cart CTA ── */}
                            <Pressable
                                onPress={handleAddToCart}
                                className="bg-orange-500 py-4 rounded-2xl flex-row items-center justify-center"
                                style={{ shadowColor: '#f97316', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 }}
                            >
                                <Ionicons name="cart" size={20} color="#fff" />
                                <Text className="text-white font-bold text-base ml-2">
                                    Add to Cart · {formatCurrency(total)}
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
});

ProductModal.displayName = 'ProductModal';

export default ProductModal;
