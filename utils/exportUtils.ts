// ─── Export Utilities (CSV & JSON) ───────────────────────────────────────────

import { CustomDateRange, DateRangeFilter, Order } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { filterOrdersByRange } from './dateUtils';

/** Build CSV content from orders */
function buildCSV(orders: Order[]): string {
    const header = ['Order #', 'Date', 'Items', 'Total (₱)'];
    const rows = orders.map((o) => {
        const items = o.items
            .map((i) => `${i.product.name} x${i.quantity} (${i.selectedSize})`)
            .join(' | ');
        return [`#${o.orderNumber}`, o.createdAt, `"${items}"`, o.totalPrice.toFixed(2)];
    });
    return [header, ...rows].map((r) => r.join(',')).join('\n');
}

/** Export orders as CSV */
export async function exportOrdersAsCSV(
    orders: Order[],
    filter: DateRangeFilter,
    custom?: CustomDateRange,
): Promise<void> {
    const filtered = filterOrdersByRange(orders, filter, custom);
    if (filtered.length === 0) throw new Error('No orders in selected range');

    const csv = buildCSV(filtered);
    const path = FileSystem.documentDirectory + `orders_export_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Share Orders CSV' });
    }
}

/** Export orders as JSON */
export async function exportOrdersAsJSON(
    orders: Order[],
    filter: DateRangeFilter,
    custom?: CustomDateRange,
): Promise<void> {
    const filtered = filterOrdersByRange(orders, filter, custom);
    if (filtered.length === 0) throw new Error('No orders in selected range');

    const json = JSON.stringify(filtered, null, 2);
    const path = FileSystem.documentDirectory + `orders_export_${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(path, json, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Share Orders JSON' });
    }
}
