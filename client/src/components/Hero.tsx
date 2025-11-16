import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Hero() {
  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('home-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/uploads/navy editorial hero.png"
          alt="FitsNew Hero"
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 w-full">
          <div className="max-w-2xl">
            {/* Text content */}
            <div className="space-y-6 md:space-y-8">
              <h1
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold uppercase tracking-[-0.02em] text-ui-text font-display leading-[0.95]"
                data-testid="text-hero-title"
              >
                ESSENTIALS,<br />REDEFINED
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-[#666666] leading-relaxed max-w-md font-sans font-normal">
                Timeless basics crafted for everyday comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="bg-brand-navy text-white px-8 py-3 rounded-md font-semibold hover:bg-[#0B2458] transition-colors w-full sm:w-auto"
                    data-testid="button-shop-now"
                  >
                    SHOP NOW
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-ui-text text-ui-text bg-white px-8 py-3 rounded-md hover:bg-ui-bg-soft transition-colors w-full sm:w-auto"
                  onClick={handleScrollClick}
                  data-testid="button-explore"
                >
                  EXPLORE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (mouse outline with animated dot) */}
      <a
        href="#home-content"
        aria-label="Scroll down"
        className="absolute left-1/2 -translate-x-1/2 bottom-8 cursor-pointer transition-transform hover:scale-110 z-20"
        onClick={handleScrollClick}
      >
        <span className="scroll-mouse-indicator" />
      </a>
    </section>
  );
}
