import { useQuery } from "@tanstack/react-query";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductGrid } from "@/components/ProductGrid";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import fitsAgainImage from "@assets/generated_images/FitsAgain_vintage_section_image_18f74a18.png";

export default function Home() {
  const { data: featured } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const { data: trending } = useQuery<Product[]>({
    queryKey: ["/api/products/trending"],
  });

  return (
    <div>
      <Hero />
      <CategoryGrid />

      <section className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-3xl md:text-5xl font-bold"
              data-testid="text-trending-title"
            >
              Trending Now
            </h2>
            <Link href="/shop">
              <Button variant="outline" data-testid="button-view-all-trending">
                View All
              </Button>
            </Link>
          </div>
          <ProductGrid products={trending} />
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-3xl md:text-5xl font-bold"
              data-testid="text-new-arrivals-title"
            >
              New Arrivals
            </h2>
            <Link href="/shop">
              <Button variant="outline" data-testid="button-view-all-arrivals">
                View All
              </Button>
            </Link>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2
                className="text-4xl md:text-6xl font-bold font-display text-amber-900"
                data-testid="text-fitsagain-title"
              >
                FitsAgain
              </h2>
              <p className="text-lg md:text-xl text-amber-800 leading-relaxed">
                Discover curated vintage and pre-loved fashion. Unique pieces with
                character and history, sustainably styled for the modern wardrobe.
              </p>
              <Link href="/fitsagain">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                  data-testid="button-explore-fitsagain"
                >
                  Explore Collection
                </Button>
              </Link>
            </div>
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-xl">
              <img
                src={fitsAgainImage}
                alt="FitsAgain Vintage Collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
