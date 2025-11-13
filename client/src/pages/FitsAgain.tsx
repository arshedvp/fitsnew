import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { ProductGrid } from "@/components/ProductGrid";
import fitsAgainImage from "@assets/generated_images/FitsAgain_vintage_section_image_18f74a18.png";

export default function FitsAgain() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const vintageProducts = products?.filter(
    (product) => product.brand === "FitsAgain"
  );

  return (
    <div className="min-h-screen">
      <section
        className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${fitsAgainImage})` }}
        />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1
              className="text-5xl md:text-7xl font-bold font-display text-amber-900"
              data-testid="text-fitsagain-title"
            >
              FitsAgain
            </h1>
            <p className="text-lg md:text-xl text-amber-800 leading-relaxed max-w-2xl mx-auto">
              Curated vintage and pre-loved fashion. Sustainable style with unique
              character and timeless appeal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-gradient-to-b from-amber-50/50 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-amber-900 mb-4">
              Vintage Collection
            </h2>
            <p className="text-muted-foreground">
              Each piece tells a story. Discover one-of-a-kind items that bring
              nostalgia and sustainability together.
            </p>
          </div>

          <ProductGrid products={vintageProducts} isLoading={isLoading} />
        </div>
      </section>
    </div>
  );
}
