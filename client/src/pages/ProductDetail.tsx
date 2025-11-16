import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { addToCart } from "@/lib/cart";
import { generateProductWhatsAppLink } from "@/lib/whatsapp";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
  });

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    if (product) {
      if (product.stock <= 0) {
        toast({ title: "Out of stock", description: "This product is currently out of stock", variant: "destructive" });
        return;
      }

      addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        size: selectedSize,
        image: product.images[0],
      });

      toast({
        title: "Added to cart",
        description: `${product.title} (${selectedSize}) added successfully`,
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (product) {
      const productUrl = window.location.href;
      const whatsappUrl = generateProductWhatsAppLink(
        product.id,
        product.title,
        product.price,
        selectedSize,
        productUrl
      );
      window.open(whatsappUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="aspect-square" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-12 w-1/3" />
              <Skeleton className="h-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Product not found</p>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 bg-white">
      <Link href="/shop">
        <Button variant="ghost" className="mb-6 text-ui-text" data-testid="button-back-to-shop">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-ui-bg-soft rounded-lg p-6">
          <img
            src={product.images[selectedImage]}
            alt={product.title}
            className="w-full object-cover rounded-md"
            data-testid="img-product-main"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-brand-navy"
                    : "border-ui-border hover:border-ui-border"
                }`}
                data-testid={`button-image-${index}`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {product.brand === "FitsAgain" && (
              <Badge className="bg-brand-green text-white">
                Vintage
              </Badge>
            )}
            {product.isTrending && (
              <Badge className="bg-brand-navy text-white">Trending</Badge>
            )}
          </div>
          <h1
            className="text-2xl font-bold text-ui-text mb-2"
            data-testid="text-product-title"
          >
            {product.title}
          </h1>
          <p className="text-sm text-[#666666] mb-4">{product.category}</p>

          <div className="text-xl font-semibold text-ui-text mb-6" data-testid="text-product-price">
            ₹{product.price}
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block text-ui-text">
                Select Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={selectedSize === size
                      ? "bg-brand-navy text-white hover:bg-[#0B2458]"
                      : "border border-ui-border text-ui-text hover:bg-ui-bg-soft"}
                    onClick={() => setSelectedSize(size)}
                    data-testid={`button-size-${size}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              {product.stock > 0 ? (
                <Button
                  size="lg"
                  className="w-full bg-brand-navy text-white hover:bg-[#0B2458]"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              ) : (
                <Button size="lg" className="w-full" disabled data-testid="button-out-of-stock">
                  Out of stock
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-brand-green hover:bg-brand-green-100 text-white border-brand-green"
                onClick={handleWhatsAppOrder}
                data-testid="button-order-whatsapp"
              >
                <FaWhatsapp className="mr-2 h-5 w-5" />
                Order on WhatsApp
              </Button>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                <p className="text-[#666666] leading-relaxed">
                  {product.description}
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm text-[#666666]">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brand:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stock:</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
}
