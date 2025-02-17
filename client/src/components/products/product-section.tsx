import { ProductFilters } from "./product-filter";
import { ProductGrid } from "./product-grid";

export function ProductSection() {
  return (
    <section className="container px-4 py-12 mx-auto">
      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters />
        <ProductGrid />
      </div>
    </section>
  );
}
