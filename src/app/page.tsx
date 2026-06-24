import groceryData from "@/data/groceries.json";
import { GroceryList } from "./grocery-list";

export default function Home() {
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
          🛒 Grocery List
        </h1>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <GroceryList initialStores={groceryData.stores} />
      </main>
    </div>
  );
}
