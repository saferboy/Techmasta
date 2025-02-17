import { ChevronDown, Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const categories = [
  { name: "New Arrivals", href: "#" },
  { name: "Gudgets", href: "#" },
  { name: "Accessories", href: "#" },
  { name: "Electronics", href: "#" },
  { name: "Others", href: "#" },
];

const brands = [
  { name: "Apple", href: "#" },
  { name: "Ultron", href: "#" },
  { name: "Unknown", href: "#" },
  { name: "Shoppers Home", href: "#" },
  { name: "Hoichoi", href: "#" },
];

const priceRanges = [
  { range: "$0.00 - $49.99", href: "#" },
  { range: "$50.00 - $99.99", href: "#" },
];

export function ProductFilters() {
  return (
    <div className="w-full mb-6 lg:w-64 lg:mb-0">
      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Shop by Category</h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Collapsible>
                  <div className="flex items-center justify-between">
                    <a
                      href={category.href}
                      className="text-base text-muted-foreground hover:text-primary"
                    >
                      {category.name}
                    </a>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="pt-2 pl-4">
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#"
                          className="text-base text-muted-foreground hover:text-primary"
                        >
                          Subcategory 1
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-base text-muted-foreground hover:text-primary"
                        >
                          Subcategory 2
                        </a>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center justify-between mb-4 text-lg font-semibold">
            Shop by Color
            <ChevronDown className="w-4 h-4" />
          </h3>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Shop by Brand</h3>
          <ul className="space-y-2">
            {brands.map((brand) => (
              <li key={brand.name}>
                <a
                  href={brand.href}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {brand.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold">Shop by Price</h3>
          <ul className="space-y-2">
            {priceRanges.map((price) => (
              <li key={price.range}>
                <a
                  href={price.href}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {price.range}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
