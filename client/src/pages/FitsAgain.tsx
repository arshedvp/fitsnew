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
    <div className="min-h-screen bg-white">
      <section
        className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-ui-bg-soft"
      >
        <div className="absolute inset-0">
          <img
            src="/uploads/green editorial hero for fitsagain.png"
            alt="FitsAgain Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl mx-auto space-y-6">
            <img 
              src="/uploads/fitsagain logo.png" 
              alt="FitsAgain Logo" 
              className="h-16 w-auto mx-auto mb-4" 
            />
            <h1
              className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight font-display text-white"
              data-testid="text-fitsagain-title"
            >
              FitsAgain
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Curated vintage and pre-loved fashion. Sustainable style with unique
              character and timeless appeal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 bg-ui-bg-soft">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight font-display text-brand-green mb-4">
              Vintage Collection
            </h2>
            <p className="text-[#666666]">
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
