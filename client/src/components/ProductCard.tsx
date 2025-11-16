import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@shared/schema";
import { FaWhatsapp } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = encodeURIComponent(
      `Hello, I want to know more about this product from FitsNew:\n\nProduct: ${product.title}\nPrice: ₹${product.price}\nProduct Link: ${productUrl}`
    );
    window.open(`https://wa.me/918606721229?text=${message}`, "_blank");
  };

  return (
    <Link href={`/product/${product.id}`}>
      <article
        className="bg-white border border-ui-border rounded-xl shadow-card overflow-hidden h-full cursor-pointer group"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-ui-bg-soft">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-white/90 text-sm font-semibold px-3 py-1 rounded">Out of stock</div>
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.isTrending && (
              <Badge className="bg-brand-navy text-white">
                Trending
              </Badge>
            )}
            {product.brand === "FitsAgain" && (
              <Badge className="bg-brand-green text-white">
                Vintage
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-green hover:bg-brand-green-100 text-white"
            onClick={handleQuickWhatsApp}
            data-testid={`button-quick-whatsapp-${product.id}`}
          >
            <FaWhatsapp className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <h3
            className="text-sm font-semibold text-ui-text line-clamp-1"
            data-testid={`text-product-title-${product.id}`}
          >
            {product.title}
          </h3>
          <p className="text-xs text-[#666666] mt-1 line-clamp-1">
            {product.category}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-ui-text" data-testid={`text-product-price-${product.id}`}>
              ₹{product.price}
            </span>
            <button 
              className="bg-brand-navy text-white px-3 py-1 rounded-md text-xs hover:bg-[#0B2458]"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/product/${product.id}`;
              }}
            >
              Add
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
