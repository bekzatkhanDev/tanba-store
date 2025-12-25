// components/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart.store"; // ✅ Adjust path if needed

export default function BottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Only two items: Menu (Home) and Cart
  const navItems = [
    { name: "Меню", href: "/catalog", icon: HomeIcon },
    { name: "Корзина", href: "/cart", icon: ShoppingCartIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg  z-50">
      <div className="flex justify-around items-center px-6 py-3 bg-white/95 backdrop-blur-sm">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 max-w-[120px] py-1.5 rounded-xl transition-colors duration-200 ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-inherit"}`} />
                {/* Cart badge — only for Cart tab */}
                {item.name === "Корзина" && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium mt-1 ${isActive ? "text-blue-600" : "text-inherit"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}