// ─── Home Screen ─────────────────────────────────────────────────────────────
// Product grid with search, category filtering, and product modal

import CategoryBar from '@/components/CategoryBar';
import EmptyState from '@/components/EmptyState';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import SearchBar from '@/components/searchbar';
import { useProductStore } from '@/store/useProductStore';
import { Product, ProductCategory } from '@/types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Card height constant for getItemLayout performance optimization
const CARD_HEIGHT = 210;
const NUM_COLUMNS = 2;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { products, isLoaded, loadProducts } = useProductStore();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load products on first mount
  useEffect(() => { loadProducts(); }, []);

  // Filtered product list (memoized to avoid recomputing on every render)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  // Stable callback — avoids recreating on each render
  const handleProductPress = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedProduct(null);
  }, []);

  const handleCategorySelect = useCallback((cat: ProductCategory) => {
    setActiveCategory(cat);
  }, []);

  // Performance: getItemLayout avoids measuring every item
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: CARD_HEIGHT,
      offset: CARD_HEIGHT * Math.floor(index / NUM_COLUMNS),
      index,
    }),
    [],
  );

  // Memoized renderItem avoids creating a new function per render
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={handleProductPress} />
    ),
    [handleProductPress],
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-orange-50">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-orange-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ed" />

      {/* ── Header ── */}
      <View
        className="bg-white pb-2"
        style={{ paddingTop: insets.top + 12, paddingHorizontal: 16 }}
      >
        <Text className="text-2xl font-bold text-gray-800 mb-3">
          JJ's Kitchen
        </Text>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      {/* ── Category Bar ── */}
      <View className="bg-white mb-2">
        <CategoryBar active={activeCategory} onSelect={handleCategorySelect} />
      </View>

      {/* ── Product Grid ── */}
      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No items found"
            subtitle={search ? `No results for "${search}"` : 'No products in this category yet.'}
          />
        }
      />

      {/* ── Product Modal ── */}
      <ProductModal
        product={selectedProduct}
        visible={modalVisible}
        onClose={handleCloseModal}
      />
    </View>
  );
}