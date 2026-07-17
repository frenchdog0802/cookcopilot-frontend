import { api } from './client';
import { ShoppingListItem } from './types';

type ShoppingListItemDto = {
    id?: string;
    name?: string;
    details?: Partial<ShoppingListItem> & Record<string, unknown>;
};

function fromDto(dto: ShoppingListItemDto): ShoppingListItem {
    const details = dto.details ?? {};
    return {
        id: String(dto.id ?? details.id ?? ''),
        name: String(dto.name ?? details.name ?? ''),
        quantity: Number(details.quantity ?? 0),
        unit: String(details.unit ?? ''),
        checked: Boolean(details.checked ?? false),
    };
}

export function parseShoppingListItems(data: unknown): ShoppingListItem[] {
    if (Array.isArray(data)) {
        return data.map(fromDto);
    }
    if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
        return (data as { items: ShoppingListItemDto[] }).items.map(fromDto);
    }
    return [];
}

export function parseShoppingListItem(data: unknown): ShoppingListItem | null {
    if (!data || typeof data !== 'object') {
        return null;
    }
    const obj = data as Record<string, unknown>;
    if (obj.item && typeof obj.item === 'object') {
        return fromDto(obj.item as ShoppingListItemDto);
    }
    return fromDto(obj as ShoppingListItemDto);
}

export const shoppingListApi = {
    // List all shopping list items, optionally filtered by query
    list: (query?: string) => api.get<ShoppingListItem[]>(query ? `/api/shopping-list?query=${encodeURIComponent(query)}` : '/api/shopping-list'),

    // Get a single shopping list item by ID
    get: (id: string | number) => api.get<ShoppingListItem>(`/api/shopping-list/${id}`),

    // Create a new shopping list item
    create: (data: Partial<ShoppingListItem>) => api.post<ShoppingListItem>('/api/shopping-list', data),

    // Update an existing shopping list item by ID
    update: (id: string | number, data: Partial<ShoppingListItem>) => api.put<ShoppingListItem>(`/api/shopping-list/${id}`, data),

    // Delete a shopping list item by ID
    delete: (id: string | number) => api.delete<void>(`/api/shopping-list/${id}`),
};