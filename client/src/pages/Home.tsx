import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: featured } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: trending } = useQuery<Product[]>({
    queryKey: ["/api/products/trending"],
  });

  return (
    <main className="bg-white min-h-screen">
      <Hero />

      <section id="home-content" className="max-w-7xl mx-auto px-6 py-16 md:py-24 scroll-mt-24">
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-ui-text font-display"
            data-testid="text-trending-title"
          >
            Trending Now
          </h2>
          <Link href="/shop">
            <Button 
              variant="outline" 
              className="border border-ui-border text-ui-text bg-transparent px-5 py-2 rounded-md hover:bg-ui-bg-soft transition-colors text-sm"
              data-testid="button-view-all-trending"
            >
              View All
            </Button>
          </Link>
        </div>
        <ProductGrid products={trending} />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-center justify-between mb-10">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-ui-text font-display"
            data-testid="text-new-arrivals-title"
          >
            Featured
          </h2>
          <Link href="/shop">
            <Button 
              variant="outline"
              className="border border-ui-border text-ui-text bg-transparent px-5 py-2 rounded-md hover:bg-ui-bg-soft transition-colors text-sm"
              data-testid="button-view-all-arrivals"
            >
              View All
            </Button>
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>
    </main>
  );
}
