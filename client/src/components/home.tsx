import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Package, RefreshCw } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-muted/30">
        <div className="container px-4 py-12 mx-auto lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <span className="text-sm font-medium">01</span>
                <h1 className="mt-2 text-4xl font-bold lg:text-6xl">
                  Final Offer
                </h1>
                <p className="mt-4 text-xl lg:text-2xl">
                  Up to <span className="font-bold">50%</span> sale for all
                  furniture items!
                </p>
              </div>
              <Button size="lg" className="rounded-none">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="relative h-[300px] lg:h-[500px] rounded-md">
              <img
                src="https://m.media-amazon.com/images/I/61C5t1ltM5L.__AC_SX300_SY300_QL70_FMwebp_.jpg"
                alt="Featured headphones"
                className=""
              />
            </div>
          </div>
        </div>
        <div className="container grid grid-cols-1 gap-4 px-4 py-8 mx-auto border-t md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <p className="text-sm font-medium">Two years warranty</p>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <p className="text-sm font-medium">Free shipping</p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            <p className="text-sm font-medium">Return policy in 30 days</p>
          </div>
        </div>
      </section>

      <section className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] bg-muted/30">
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <h3 className="text-2xl font-bold">New Furniture</h3>
              <Button variant="outline" className="self-start">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] bg-muted/30">
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <h3 className="text-2xl font-bold">Electronics Sale</h3>
              <Button variant="outline" className="self-start">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
