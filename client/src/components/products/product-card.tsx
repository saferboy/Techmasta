import { useCartStore } from "@/store/cart-store";
import { Badge, ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
  image: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      description: "Added to cart",
      className: "bg-green-500 text-white",
    });
  };

  return (
    <div className="relative p-4 rounded-lg group bg-background">
      {product.isNew && (
        <Badge className="absolute z-10 top-2 left-2">New</Badge>
      )}
      <div className="mb-3 overflow-hidden rounded-lg aspect-square bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2 transition-opacity opacity-0 group-hover:opacity-100">
          <Button variant="secondary" onClick={handleAddToCart}>
            <ShoppingCart className="!size-6" />
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.color}</p>
        <p className="mt-1 font-medium">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
