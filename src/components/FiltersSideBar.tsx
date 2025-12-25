"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const categories = ["electronics", "clothes", "home", "toys", "other"];

type Filters = {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  currentFilters: Filters;
  onApply: (filters: Filters) => void;
};

export default function FiltersSidebar({
  open,
  onClose,
  currentFilters,
  onApply,
}: Props) {
  const [local, setLocal] = useState<Filters>(currentFilters);

  useEffect(() => {
    if (open) setLocal(currentFilters);
  }, [open, currentFilters]);

  function apply() {
    onApply(local);
    onClose();
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Фильтры</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <select
            value={local.category ?? ""}
            onChange={(e) =>
              setLocal({
                ...local,
                category: e.target.value || undefined,
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Цена от"
            value={local.minPrice ?? ""}
            onChange={(e) =>
              setLocal({
                ...local,
                minPrice: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Цена до"
            value={local.maxPrice ?? ""}
            onChange={(e) =>
              setLocal({
                ...local,
                maxPrice: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
            className="w-full border p-2 rounded"
          />

          <button
            onClick={apply}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Применить
          </button>
        </div>
      </div>

      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}
