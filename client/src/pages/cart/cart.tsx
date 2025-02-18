import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useCartStore } from "../../store/cart-store";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <h2 className="mb-4 text-2xl font-bold">Savatingiz boʻsh</h2>
        <p className="mb-8 text-muted-foreground">
          Bu yerda ko‘rish uchun ba’zi mahsulotlarni savatga qo‘shing.
        </p>
        <Link to="/">
          <Button>Xarid qilishda davom etish </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-16 mx-auto">
      <Link to="/" className="underline">
        Xarid qilishda davom etish
      </Link>
      <h2 className="mb-8 text-2xl font-bold">Xarid savati</h2>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="object-cover w-24 h-24 rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.color}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="p-6 space-y-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Barcha buyurtmalar</h3>
            <div className="space-y-2">
              <div className="pt-2 mt-2 border-t">
                <div className="flex justify-between">
                  <span className="font-semibold">Umumiy</span>
                  <span className="font-semibold">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Button className="w-full">Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
