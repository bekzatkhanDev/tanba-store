"use client";

import { useState } from "react";

export function useCatalogFilters(initial: any) {
  const [filters, setFilters] = useState(initial);

  const update = (data: any) => {
    setFilters((prev: any) => ({ ...prev, ...data }));
  };

  return { filters, update };
}
