import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCartStore } from "../store/cart-store";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Post", href: "/post" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart-page");
  };

  return (
    <header className="border-b">
      <nav className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 text-xl font-bold">
            TECHMASTA
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                item.href === "/" ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-end flex-1 gap-x-6">
          <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products" className="w-full pl-8" />
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <User className="!size-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={handleCartClick}
          >
            <ShoppingCart className="!size-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <span className="sr-only">Open menu</span>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
