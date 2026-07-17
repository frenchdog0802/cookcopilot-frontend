import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeftIcon, PlusIcon, MinusIcon, TrashIcon, SearchIcon, PackageIcon } from 'lucide-react';
import { usePantry } from '../contexts/pantryContext';
import { IngredientEntry, PantryItem } from '../api/types';
import useSearchIngredients from '../hooks/useSearchIngredient';
import { NumberInput } from './NumberInput';

interface PantryInventoryProps {
    onBack: () => void;
}

export function PantryInventory({ onBack }: PantryInventoryProps) {
    const {
        pantryItems: oriPantryItems,
        updatePantryItem,
        addPantryItem,
        removePantryItem,
        ingredients,
        fetchAllPantryItems,
    } = usePantry();

    const [pantryItems, setPantryItems] = useState<PantryItem[]>(oriPantryItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        quantity: 1,
        unit: '',
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);  // ???????????????

    // Pantry item search dropdown????? name???? debounce??
    const { filteredIngredients: filteredPantryIngredients, loading: pantryLoading } = useSearchIngredients(
        newItem.name,
        ingredients
    );

    // Auto-select if exactly one match and exact name match?? useMemo ?????????????
    const autoSelectLogic = useMemo(() => {
        if (filteredPantryIngredients.length === 1) {
            const match = filteredPantryIngredients[0];
            if (match.name.toLowerCase() === newItem.name.toLowerCase()) {
                setNewItem(prev => ({
                    ...prev,
                    name: match.name,
                    unit: match.default_unit || '',
                }));
                setShowDropdown(false);
                setSelectedIndex(-1);
            }
        }
    }, [newItem.name, filteredPantryIngredients]);

    useEffect(() => {
        autoSelectLogic;
    }, [autoSelectLogic]);

    // Filter pantry items based on search query
    const filteredItems = useMemo(() => {
        return pantryItems.filter(item => {
            const isEnglish = /^[\x00-\x7F]*$/.test(item.name);
            const matchesSearch = isEnglish
                ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
                : item.name.includes(searchQuery);
            return matchesSearch;
        });
    }, [pantryItems, searchQuery]);

    useEffect(() => {
        fetchAllPantryItems();
    }, []);

    // Sync oriPantryItems to local pantryItems
    useEffect(() => {
        setPantryItems(oriPantryItems);
    }, [oriPantryItems]);

    // ?????????????????
    const handleSelectIngredient = (ingredient: IngredientEntry) => {
        setNewItem({
            name: ingredient.name,
            quantity: 1,
            unit: ingredient.default_unit || "",
        });
        setShowDropdown(false);
        setSelectedIndex(-1);
    };

    const handleUpdateQuantity = (itemName: string, amount: number) => {
        const item = pantryItems.find(item => item.name === itemName);
        if (item) {
            const newQuantity = item.quantity + amount;
            if (newQuantity >= 0) {
                updatePantryItem({ ...item, quantity: newQuantity });
            }
        }
    };

    const handleRemoveItem = (itemName: string) => {
        const item = pantryItems.find(item => item.name === itemName);
        if (item && removePantryItem) {
            removePantryItem(item.id);
        }
    };

    const handleAddItem = () => {
        if (!newItem.name.trim()) return;
        // Check if item already exists
        const existingItem = pantryItems.find(item => item.name.toLowerCase() === newItem.name.toLowerCase());
        if (existingItem) {
            updatePantryItem({ ...existingItem, quantity: newItem.quantity });
        } else {
            // Add new item
            addPantryItem({ ...newItem });
        }
        // Reset form
        setNewItem({
            name: '',
            quantity: 1,
            unit: '',
        });
        setIsAddingItem(false);
    };

    const handleCancelAddItem = () => {
        setNewItem({
            name: '',
            quantity: 1,
            unit: '',
        });
        setShowDropdown(false);
        setSelectedIndex(-1);
        setIsAddingItem(false);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-linen">
            <div className="flex-1 overflow-y-auto pb-20 lg:pb-6">
                {/* Page title */}
                <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 flex items-center gap-4">
                    <button onClick={onBack} className="lg:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-sage/50 transition-colors" aria-label="Go back">
                        <ArrowLeftIcon size={22} />
                    </button>
                    <h1 className="page-title animate-fade-in">Kitchen Inventory</h1>
                </div>

                {/* Main Content */}
                <main className="flex-1 max-w-6xl mx-auto w-full px-6 lg:px-8 py-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon size={18} className="text-muted" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-herb/30 focus:border-transparent"
                        />
                    </div>

                    {/* Add New Item Button */}
                    {!isAddingItem ? (
                        <button
                            onClick={() => setIsAddingItem(true)}
                            className="w-full flex items-center justify-center gap-2 bg-surface border border-line hover:bg-linen text-ink font-medium py-3 px-4 rounded-xl mb-6 shadow-sm transition-colors"
                        >
                            <PlusIcon size={18} />
                            <span>Add New Item</span>
                        </button>
                    ) : (
                        <div className="bg-surface p-4 rounded-xl shadow-sm border border-line mb-6">
                            <h3 className="font-medium text-ink mb-3">Add New Item</h3>

                            <div className="space-y-3 relative">
                                <input
                                    type="text"
                                    placeholder="Search or add item name"
                                    value={newItem.name}
                                    onChange={(e) => {
                                        const newName = e.target.value;
                                        setNewItem({ ...newItem, name: newName });
                                        setShowDropdown(newName.length > 0);
                                        setSelectedIndex(-1);  // ???????
                                    }}
                                    onKeyDown={(e) => {
                                        if (!showDropdown || filteredPantryIngredients.length === 0) return;

                                        switch (e.key) {
                                            case 'ArrowDown':
                                                e.preventDefault();
                                                setSelectedIndex(prev => (prev < filteredPantryIngredients.length - 1 ? prev + 1 : 0));
                                                break;
                                            case 'ArrowUp':
                                                e.preventDefault();
                                                setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredPantryIngredients.length - 1));
                                                break;
                                            case 'Enter':
                                                e.preventDefault();
                                                if (selectedIndex >= 0) {
                                                    const selected = filteredPantryIngredients[selectedIndex];
                                                    handleSelectIngredient(selected);
                                                } else if (filteredPantryIngredients.length === 1) {
                                                    // Fallback to auto-select
                                                    handleSelectIngredient(filteredPantryIngredients[0]);
                                                }
                                                break;
                                            case 'Escape':
                                                setShowDropdown(false);
                                                setSelectedIndex(-1);
                                                break;
                                        }
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => setShowDropdown(false), 200);
                                    }}
                                    className="w-full p-2 border border-line rounded-lg"
                                />

                                {showDropdown && (
                                    <ul className="absolute z-10 w-full bg-surface border border-line rounded-lg shadow-lg max-h-40 overflow-y-auto mt-1">
                                        {pantryLoading ? (
                                            <li className="p-3 text-center text-muted text-sm flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-herb mr-2"></div>
                                                Loading...
                                            </li>
                                        ) : filteredPantryIngredients.length > 0 ? (
                                            filteredPantryIngredients.map((ingredient: IngredientEntry, index: number) => {
                                                const isSelected = index === selectedIndex;
                                                // ???????????????????
                                                const query = newItem.name.toLowerCase();
                                                const highlightedName = ingredient.name.replace(
                                                    new RegExp(`(${query})`, 'gi'),
                                                    '<mark class="bg-yellow-200">$1</mark>'
                                                );
                                                return (
                                                    <li key={ingredient.id} className={`p-3 ${isSelected ? 'bg-sage/50' : 'hover:bg-sage/50'}`}>
                                                        <button
                                                            onClick={() => handleSelectIngredient(ingredient)}
                                                            className={`w-full text-left ${isSelected ? 'font-medium' : ''}`}
                                                            dangerouslySetInnerHTML={{ __html: highlightedName + ` <span class="text-sm text-muted">(${ingredient.default_unit})</span>` }}
                                                        />
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li className="p-3 text-center text-muted text-sm">
                                                No matching ingredients. Try typing more letters.
                                            </li>
                                        )}
                                    </ul>
                                )}

                                <div className="flex gap-2">
                                    <NumberInput
                                        min={0.1}
                                        step={0.5}
                                        value={newItem.quantity}
                                        onChange={value =>
                                            setNewItem({
                                                ...newItem,
                                                quantity: value
                                            })
                                        }
                                        className="w-1/3 p-2 rounded-lg"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Unit (g, ml, etc.)"
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        className="w-2/3 p-2 border border-line rounded-lg"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button onClick={() => handleCancelAddItem()} className="w-1/2 bg-sage/40 text-ink py-2 rounded-lg">
                                        Cancel
                                    </button>
                                    <button onClick={handleAddItem} className="w-1/2 bg-herb text-white py-2 rounded-lg">
                                        Add Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="bg-surface rounded-xl p-3 mb-4 shadow-sm border border-line">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-sage/500"></div>
                                <span className="text-muted font-medium">Planned</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-sage/500"></div>
                                <span className="text-muted font-medium">To Buy</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-sage/500"></div>
                                <span className="text-muted font-medium">Pantry</span>
                            </div>
                        </div>
                    </div>

                    {/* Pantry Items List */}
                    <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-4 lg:gap-3 lg:space-y-0 lg:auto-rows-fr">
                        {filteredItems.length === 0 ? (
                            <div className="bg-surface rounded-xl p-6 text-center shadow-sm border border-line">
                                <PackageIcon size={32} className="mx-auto mb-2 text-muted/40" />
                                <p className="text-muted text-sm">No items found</p>
                                {searchQuery && (
                                    <p className="text-muted text-xs mt-1">Try a different search term</p>
                                )}
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div key={item.name} className="bg-surface rounded-xl shadow-sm border border-line overflow-hidden flex flex-col">
                                    {/* Item Header */}
                                    <div className="p-3 pb-2 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-ink capitalize truncate text-sm">{item.name}</h3>
                                                <p className="text-[11px] text-muted mt-0.5">{item.unit}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.name)}
                                                className="p-1.5 rounded-lg hover:bg-sage/50 active:bg-sage text-muted hover:text-herb transition-colors -mr-1"
                                                aria-label="Remove item"
                                            >
                                                <TrashIcon size={14} />
                                            </button>
                                        </div>

                                        {/* Status Grid */}
                                        <div className="grid grid-cols-3 gap-1.5 mb-2">
                                            <div className="bg-sage/50 rounded-md p-1.5 text-center border border-blue-100">
                                                <span className="text-[10px] font-medium text-herb block mb-0.5">Planned</span>
                                                <span className="text-sm font-bold text-blue-900">{item.item_planned || 0}</span>
                                            </div>
                                            <div className="bg-sage/50 rounded-md p-1.5 text-center border border-amber-100">
                                                <span className="text-[10px] font-medium text-muted block mb-0.5">To Buy</span>
                                                <span className="text-sm font-bold text-amber-900">{item.item_to_buy || 0}</span>
                                            </div>
                                            <div className="bg-sage/50 rounded-md p-1.5 text-center border border-line">
                                                <span className="text-[10px] font-medium text-herb block mb-0.5">Pantry</span>
                                                <span className="text-sm font-bold text-green-900">{item.quantity || 0}</span>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-center gap-3 pt-2 mt-auto border-t border-line">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.name, -0.5)}
                                                className="p-2 rounded-lg bg-sage/40 hover:bg-sage/60 active:bg-sage transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <MinusIcon size={16} className="text-ink" />
                                            </button>
                                            <div className="text-center min-w-[40px]">
                                                <div className="text-lg font-bold text-ink leading-none">{item.quantity}</div>
                                            </div>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.name, 0.5)}
                                                className="p-2 rounded-lg bg-herb hover:bg-herb active:bg-herb-deep transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <PlusIcon size={16} className="text-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}