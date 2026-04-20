// ─── Date Range Filtering Utilities ──────────────────────────────────────────

import { CustomDateRange, DateRangeFilter, Order } from '@/types';

/** Returns start-of-day for N days ago */
export function daysAgo(n: number): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);
    return d;
}

/** Filter orders by a named range or custom date range */
export function filterOrdersByRange(
    orders: Order[],
    filter: DateRangeFilter,
    custom?: CustomDateRange,
): Order[] {
    const now = new Date();
    let from: Date;
    let to: Date = now;

    if (filter === '7days') {
        from = daysAgo(7);
    } else if (filter === '30days') {
        from = daysAgo(30);
    } else if (filter === 'custom' && custom) {
        from = custom.from;
        to = custom.to;
    } else {
        return orders; // no filter
    }

    return orders.filter((o) => {
        const created = new Date(o.createdAt);
        return created >= from && created <= to;
    });
}

/** Format a Date as a readable string */
export function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/** Format PHP currency */
export function formatCurrency(amount: number): string {
    return `₱${amount.toFixed(2)}`;
}
