// ─── Manage Screen (Admin) ────────────────────────────────────────────────────
// CRUD interface for managing products

import EmptyState from '@/components/EmptyState';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { useProductStore } from '@/store/useProductStore';
import { Product, ProductCategory } from '@/types';
import { formatCurrency } from '@/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES: ProductCategory[] = ['Main Foods', 'Desserts', 'Drinks', 'Add-ons'];

type FormData = {
  name: string;
  price: string;
  category: ProductCategory;
  image: string;
  description: string;
};

const DEFAULT_FORM: FormData = {
  name: '',
  price: '',
  category: 'Main Foods',
  image: '',
  description: '',
};

type SettingsRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  danger?: boolean;
  onPress?: () => void;
  rightLabel?: string;
  rightContent?: React.ReactNode;
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-2xl p-3 mb-4" style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <Text className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1 mb-2">
        {title}
      </Text>
      {children}
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  danger,
  onPress,
  rightLabel,
  rightContent,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-xl px-2 py-3"
      disabled={!onPress}
    >
      <View className={`w-9 h-9 rounded-lg items-center justify-center mr-3 ${danger ? 'bg-red-50' : 'bg-orange-50'}`}>
        <Ionicons name={icon} size={18} color={danger ? '#EF4444' : '#F97316'} />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold ${danger ? 'text-red-500' : 'text-gray-800'}`}>
          {title}
        </Text>
        {subtitle ? <Text className="text-xs text-gray-500 mt-0.5">{subtitle}</Text> : null}
      </View>
      {rightContent ?? (
        rightLabel
          ? <Text className="text-xs text-gray-500 font-semibold">{rightLabel}</Text>
          : <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      )}
    </Pressable>
  );
}

export default function ManageScreen() {
  const insets = useSafeAreaInsets();
  const clearCart = useCartStore((s) => s.clearCart);
  const cartCount = useCartStore((s) => s.totalItemCount());
  const { orders } = useOrderStore();
  const { products, isLoaded, loadProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [productsModalVisible, setProductsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => { loadProducts(); }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm((f) => ({ ...f, image: result.assets[0].uri }));
    }
  };

  const openAddModal = useCallback(() => {
    setEditingProduct(null);
    setForm(DEFAULT_FORM);
    setModalVisible(true);
  }, []);

  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description ?? '',
    });
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingProduct(null);
    setForm(DEFAULT_FORM);
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Product name is required.'); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) { Alert.alert('Error', 'Enter a valid price.'); return; }

    setSaving(true);
    const productData: Product = {
      id: editingProduct?.id ?? `p_${Date.now()}`,
      name: form.name.trim(),
      price,
      category: form.category,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
      description: form.description.trim(),
      availableSizes: ['Small', 'Medium', 'Large'],
      availableAddOns: [],
    };

    if (editingProduct) {
      await updateProduct(productData);
    } else {
      await addProduct(productData);
    }
    setSaving(false);
    closeModal();
  }, [form, editingProduct, addProduct, updateProduct, closeModal]);

  const handleDelete = useCallback((product: Product) => {
    Alert.alert(
      'Delete Product',
      `Remove "${product.name}" from the menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(product.id) },
      ],
    );
  }, [deleteProduct]);

  const handleClearCart = useCallback(() => {
    if (cartCount === 0) {
      Alert.alert('Cart is empty', 'There are no items to clear.');
      return;
    }

    Alert.alert('Clear Cart', 'Remove all items from the cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearCart();
          Alert.alert('Done', 'Cart was cleared.');
        },
      },
    ]);
  }, [cartCount, clearCart]);

  const handleResetProducts = useCallback(() => {
    Alert.alert('Not available yet', 'Product reset action can be wired to your sample data loader.');
  }, []);

  const handleExportOrders = useCallback(() => {
    Alert.alert('Coming soon', 'Order export can be connected to export utils.');
  }, []);

  const renderItem = useCallback(({ item }: { item: Product }) => (
    <View
      className="flex-row items-center bg-white rounded-2xl mb-3 p-3"
      style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}
    >
      <View
        className="w-12 h-12 rounded-xl bg-orange-100 items-center justify-center mr-3 overflow-hidden"
      >
        {item.image ? (
          <Ionicons name="image-outline" size={24} color="#f97316" />
        ) : (
          <Ionicons name="fast-food-outline" size={24} color="#f97316" />
        )}
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-800" numberOfLines={1}>{item.name}</Text>
        <View className="flex-row items-center mt-0.5">
          <View className="bg-orange-50 rounded-full px-2 py-0.5 mr-2">
            <Text className="text-orange-500 text-xs">{item.category}</Text>
          </View>
          <Text className="text-gray-500 text-sm font-semibold">{formatCurrency(item.price)}</Text>
        </View>
      </View>
      <Pressable
        onPress={() => openEditModal(item)}
        className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-2"
        hitSlop={4}
      >
        <Ionicons name="pencil-outline" size={16} color="#3B82F6" />
      </Pressable>
      <Pressable
        onPress={() => handleDelete(item)}
        className="w-9 h-9 rounded-full bg-red-50 items-center justify-center"
        hitSlop={4}
      >
        <Ionicons name="trash-outline" size={16} color="#EF4444" />
      </Pressable>
    </View>
  ), [openEditModal, handleDelete]);

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
      <View
        className="bg-white pb-3"
        style={{ paddingTop: insets.top + 12, paddingHorizontal: 16 }}
      >
        <Text className="text-2xl font-bold text-gray-800">⚙️ Settings</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Manage products and app preferences.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard title="Manage Products">
          <SettingsRow
            icon="list-outline"
            title="View Products"
            subtitle="Edit or delete existing menu items"
            rightLabel={`${products.length} items`}
            onPress={() => setProductsModalVisible(true)}
          />
          <SettingsRow
            icon="add-circle-outline"
            title="Add New Product"
            subtitle="Create a new menu item"
            onPress={openAddModal}
          />
        </SectionCard>

        <SectionCard title="Orders and Data">
          <SettingsRow
            icon="receipt-outline"
            title="Total Orders"
            subtitle="Snapshot of recorded orders"
            rightLabel={`${orders.length}`}
          />
          <SettingsRow
            icon="download-outline"
            title="Export Orders"
            subtitle="CSV / JSON export"
            onPress={handleExportOrders}
          />
          <SettingsRow
            icon="cart-outline"
            title="Clear Cart"
            subtitle="Remove all pending cart items"
            danger
            onPress={handleClearCart}
          />
        </SectionCard>

        <SectionCard title="App Options">
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Show order and update alerts"
            rightContent={(
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#FDBA74' }}
                thumbColor={notificationsEnabled ? '#F97316' : '#F9FAFB'}
              />
            )}
          />
          <SettingsRow
            icon="volume-high-outline"
            title="Sound Effects"
            subtitle="Play sound on actions"
            rightContent={(
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#D1D5DB', true: '#FDBA74' }}
                thumbColor={soundEnabled ? '#F97316' : '#F9FAFB'}
              />
            )}
          />
        </SectionCard>

        <SectionCard title="Danger Zone">
          <SettingsRow
            icon="refresh-circle-outline"
            title="Reset Product Data"
            subtitle="Restore products from defaults"
            danger
            onPress={handleResetProducts}
          />
        </SectionCard>
      </ScrollView>

      <Modal visible={productsModalVisible} animationType="slide">
        <SafeAreaView className="flex-1 bg-orange-50">
          <View className="px-4 pb-3 pt-2 bg-white flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-800">Manage Products</Text>
            <Pressable
              onPress={() => setProductsModalVisible(false)}
              className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>

          <FlatList
            data={products}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: insets.bottom + 100,
              flexGrow: 1,
            }}
            initialNumToRender={10}
            windowSize={5}
            ListEmptyComponent={(
              <EmptyState
                icon="fast-food-outline"
                title="No products yet"
                subtitle='Tap "Add New Product" to create your first item.'
              />
            )}
          />

          <Pressable
            onPress={openAddModal}
            className="absolute right-5 bg-orange-500 w-14 h-14 rounded-full items-center justify-center"
            style={{
              bottom: insets.bottom + 24,
              shadowColor: '#f97316',
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </Pressable>
        </SafeAreaView>
      </Modal>

      <Modal visible={modalVisible} animationType="slide" transparent presentationStyle="overFullScreen">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <Pressable className="flex-1 bg-black/50" onPress={closeModal} />
          <View
            className="bg-white rounded-t-3xl"
            style={{ maxHeight: '90%', position: 'absolute', bottom: 0, left: 0, right: 0 }}
          >
            <SafeAreaView>
              <View className="items-center pt-3 pb-1">
                <View className="w-10 h-1 rounded-full bg-gray-300" />
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View className="p-5">
                  <Text className="text-xl font-bold text-gray-800 mb-5">
                    {editingProduct ? '✏️ Edit Product' : '➕ Add Product'}
                  </Text>

                  {/* Name */}
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Product Name *</Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                    placeholder="e.g. Lechon Kawali"
                    className="bg-gray-50 rounded-2xl px-4 py-3 text-gray-800 mb-4 border border-gray-200"
                  />

                  {/* Price */}
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Price (₱) *</Text>
                  <TextInput
                    value={form.price}
                    onChangeText={(t) => setForm((f) => ({ ...f, price: t }))}
                    placeholder="e.g. 150"
                    keyboardType="numeric"
                    className="bg-gray-50 rounded-2xl px-4 py-3 text-gray-800 mb-4 border border-gray-200"
                  />

                  {/* Category */}
                  <Text className="text-sm font-semibold text-gray-600 mb-2">Category *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                    {CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => setForm((f) => ({ ...f, category: cat }))}
                        className={`px-4 py-2 rounded-full mr-2 ${form.category === cat ? 'bg-orange-500' : 'bg-gray-100'
                          }`}
                      >
                        <Text className={`text-sm font-medium ${form.category === cat ? 'text-white' : 'text-gray-600'}`}>
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>

                  {/* Image */}
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Image source (URL or Local)</Text>
                  <View className="flex-row items-center mb-4 gap-2">
                    <TextInput
                      value={form.image}
                      onChangeText={(t) => setForm((f) => ({ ...f, image: t }))}
                      placeholder="https://... or Pick below"
                      autoCapitalize="none"
                      className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-gray-800 border border-gray-200"
                    />
                    <Pressable
                      onPress={pickImage}
                      className="bg-orange-100 p-3 rounded-2xl border border-orange-200 flex-row items-center justify-center"
                      style={{ height: 50, width: 50 }}
                    >
                      <Ionicons name="image" size={20} color="#f97316" />
                    </Pressable>
                  </View>

                  {/* Description */}
                  <Text className="text-sm font-semibold text-gray-600 mb-1">Description</Text>
                  <TextInput
                    value={form.description}
                    onChangeText={(t) => setForm((f) => ({ ...f, description: t }))}
                    placeholder="Short description..."
                    multiline
                    numberOfLines={3}
                    className="bg-gray-50 rounded-2xl px-4 py-3 text-gray-800 mb-6 border border-gray-200"
                    style={{ textAlignVertical: 'top', minHeight: 80 }}
                  />

                  {/* Save Button */}
                  <Pressable
                    onPress={handleSave}
                    disabled={saving}
                    className="bg-orange-500 py-4 rounded-2xl items-center justify-center"
                    style={{ shadowColor: '#f97316', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 }}
                  >
                    {saving
                      ? <ActivityIndicator color="#fff" />
                      : <Text className="text-white font-bold text-base">
                        {editingProduct ? 'Save Changes' : 'Add Product'}
                      </Text>}
                  </Pressable>
                </View>
              </ScrollView>
            </SafeAreaView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}