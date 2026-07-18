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

/** Backend Create/Update DTOs expect { name, details: { quantity, unit, checked } }. */
function toRequestPayload(data: Partial<ShoppingListItem>) {
    return {
        name: data.name,
        details: {
            quantity: data.quantity,
            unit: data.unit,
            checked: data.checked ?? false,
        },
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
    list: (query?: string) =>
        api.get<unknown>(query ? `/api/shopping-list?query=${encodeURIComponent(query)}` : '/api/shopping-list'),

    get: (id: string | number) => api.get<unknown>(`/api/shopping-list/${id}`),

    create: (data: Partial<ShoppingListItem>) =>
        api.post<unknown>('/api/shopping-list', toRequestPayload(data)),

    update: (id: string | number, data: Partial<ShoppingListItem>) =>
        api.put<unknown>(`/api/shopping-list/${id}`, toRequestPayload(data)),

    delete: (id: string | number) => api.delete<void>(`/api/shopping-list/${id}`),
};
