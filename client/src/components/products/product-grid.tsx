import { Grid, List } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ProductCard } from "./product-card";

const products = [
  {
    id: 1,
    name: "Cap for Boys",
    price: 35.0,
    color: "Blank and White",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-t6T1FH1aEDFgT3TSpPR6DTs9PBGxkA.png",
    // isNew: true,
  },
  {
    id: 2,
    name: "Girl equipment",
    price: 180.0,
    color: "Gray",
    image:
      "https://s.alicdn.com/@sc04/kf/Hfb83838c8e8d49f29664ac00301b4c8fr.jpg_300x300q80.jpg",
    // isNew: true,
  },
  {
    id: 3,
    name: "Running shoes",
    price: 25.0,
    color: "Mixed",
    image:
      "https://s.alicdn.com/@sc04/kf/H28c3ff64cebb4095bde22a8aa9424a71q.jpeg_300x300q80.jpg",
    isNew: true,
  },
];

export function ProductGrid() {
  return (
    <div className="flex-1">
      <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="w-12 h-12">
            <Grid className="w-6 h-6" />
          </Button>

          <Button variant="outline" size="icon" className="w-12 h-12">
            <List className="w-6 h-6" />
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-base text-muted-foreground">
              Sort by:
            </span>
            <Select defaultValue="best-sellers">
              <SelectTrigger className="w-[180px]  text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best-sellers">Best Sellers</SelectItem>
                <SelectItem value="price-low">Narxi: Pasdan tepaga</SelectItem>
                <SelectItem value="price-high">Narxi: Tepadan pasga</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base text-muted-foreground">
              Show:
            </span>
            <Select defaultValue="12">
              <SelectTrigger className="w-[80px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="36">36</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
