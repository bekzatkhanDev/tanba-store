import { HomeIcon, ShoppingCartIcon, UserIcon, HeartIcon } from "@heroicons/react/24/outline";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t">
      <div className="flex justify-around items-center py-2">
        {/* Главная */}
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs">Главная</span>
        </button>

        {/* Корзина */}
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 relative">
          <ShoppingCartIcon className="w-6 h-6" />
          <span className="text-xs">Корзина</span>
          {/* бейдж количества товаров */}
          <span className="absolute top-0 right-2 bg-red-600 text-white text-xs rounded-full px-1">
            0
          </span>
        </button>
      </div>
    </nav>
  );
}