import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/FitsNew_hero_banner_image_58d32b11.png";

export function Hero() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      <div className="relative h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
            data-testid="text-hero-title"
          >
            Elevate Your Style
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            Discover premium contemporary fashion and curated vintage pieces
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/shop">
              <Button
                size="lg"
                variant="default"
                className="text-base font-semibold uppercase tracking-wide min-w-40"
                data-testid="button-shop-now"
              >
                Shop Now
              </Button>
            </Link>
            <Link href="/fitsagain">
              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold uppercase tracking-wide min-w-40 bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
                data-testid="button-explore-vintage"
              >
                Explore Vintage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
