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
      <Card
        className="group hover-elevate cursor-pointer overflow-hidden h-full"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {product.isTrending && (
              <Badge variant="default" className="bg-primary">
                Trending
              </Badge>
            )}
            {product.brand === "FitsAgain" && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300">
                Vintage
              </Badge>
            )}
          </div>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-500 hover:bg-green-600 text-white"
            onClick={handleQuickWhatsApp}
            data-testid={`button-quick-whatsapp-${product.id}`}
          >
            <FaWhatsapp className="h-5 w-5" />
          </Button>
        </div>
        <CardContent className="p-4 space-y-2">
          <h3
            className="font-semibold text-lg line-clamp-1"
            data-testid={`text-product-title-${product.id}`}
          >
            {product.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-1">
            {product.category}
          </p>
          <div className="flex items-center justify-between pt-2">
            <p
              className="text-2xl font-bold"
              data-testid={`text-product-price-${product.id}`}
            >
              ₹{product.price}
            </p>
            <div className="flex gap-1">
              {product.sizes.slice(0, 3).map((size) => (
                <Badge
                  key={size}
                  variant="outline"
                  className="text-xs"
                >
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
