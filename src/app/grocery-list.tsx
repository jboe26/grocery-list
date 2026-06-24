"use client";

import { useState } from "react";

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  notes: string;
}

interface Store {
  id: string;
  name: string;
  color: string;
  icon: string;
  items: Item[];
}

export function GroceryList({ initialStores }: { initialStores: Store[] }) {
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [activeStore, setActiveStore] = useState<string>(stores[0].id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [newUnit, setNewUnit] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const toggleItem = (storeId: string, itemId: string) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? {
              ...store,
              items: store.items.map((item) =>
                item.id === itemId
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            }
          : store
      )
    );
  };

  const addItem = (storeId: string) => {
    if (!newName.trim()) return;
    const newItem: Item = {
      id: `${storeId}-${Date.now()}`,
      name: newName.trim(),
      quantity: Number(newQuantity) || 1,
      unit: newUnit.trim() || "ct",
      category: newCategory.trim() || "Other",
      checked: false,
      notes: newNotes.trim(),
    };
    setStores((prev) =>
      prev.map((store) =>
        store.id === storeId
          ? { ...store, items: [...store.items, newItem] }
          : store
      )
    );
    setNewName("");
    setNewQuantity("1");
    setNewUnit("");
    setNewCategory("");
    setNewNotes("");
    setShowAddForm(false);
  };

  const currentStore = stores.find((s) => s.id === activeStore)!;
  const categories = [...new Set(currentStore.items.map((i) => i.category))];
  const checkedCount = currentStore.items.filter((i) => i.checked).length;
  const totalCount = currentStore.items.length;
  const existingCategories = [
    ...new Set(stores.flatMap((s) => s.items.map((i) => i.category))),
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Store tabs */}
      <div className="flex gap-2">
        {stores.map((store) => {
          const storeChecked = store.items.filter((i) => i.checked).length;
          const storeTotal = store.items.length;
          return (
            <button
              key={store.id}
              onClick={() => setActiveStore(store.id)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeStore === store.id
                  ? "text-white shadow-lg scale-[1.02]"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-sm hover:shadow"
              }`}
              style={
                activeStore === store.id
                  ? { backgroundColor: store.color }
                  : undefined
              }
            >
              <span className="text-lg">{store.icon}</span>{" "}
              {store.name}
              <span className="block text-xs mt-1 opacity-80">
                {storeChecked}/{storeTotal} items
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          <span>Progress</span>
          <span>
            {checkedCount}/{totalCount} items
          </span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
              backgroundColor: currentStore.color,
            }}
          />
        </div>
      </div>

      {/* Add item */}
      {showAddForm ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-4">
          <div className="flex flex-col gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Item name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem(currentStore.id)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
                className="w-20 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
              <input
                type="text"
                placeholder="Unit (e.g. lb, box)"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              >
                <option value="">Category</option>
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => addItem(currentStore.id)}
                disabled={!newName.trim()}
                className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
                style={{ backgroundColor: currentStore.color }}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 py-3 text-sm font-medium text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
        >
          + Add Item
        </button>
      )}

      {/* Items by category */}
      {categories.map((category) => {
        const categoryItems = currentStore.items.filter(
          (i) => i.category === category
        );
        return (
          <div key={category}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-1">
              {category}
            </h2>
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm divide-y divide-zinc-100 dark:divide-zinc-700">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(currentStore.id, item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-750"
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.checked
                        ? "border-transparent"
                        : "border-zinc-300 dark:border-zinc-600"
                    }`}
                    style={
                      item.checked
                        ? { backgroundColor: currentStore.color }
                        : undefined
                    }
                  >
                    {item.checked && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        item.checked
                          ? "line-through text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.notes && (
                      <span className="block text-xs text-zinc-400 dark:text-zinc-500 truncate">
                        {item.notes}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                    {item.quantity} {item.unit}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
