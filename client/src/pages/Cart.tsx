import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaWhatsapp } from "react-icons/fa";
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal } from "@/lib/cart";
import { generateCartWhatsAppLink } from "@/lib/whatsapp";
import { CartItem } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      return apiRequest("GET", "/api/products");
    },
  });

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  // validate cart against current products: remove deleted or out-of-stock items
  useEffect(() => {
    if (!products) return;
    const map = new Map(products.map((p) => [p.id, p]));
    const current = getCart();
    const removed: CartItem[] = [];
    const outOfStock: CartItem[] = [];

    for (const item of current) {
      const p = map.get(item.productId);
      if (!p) {
        removed.push(item);
        removeFromCart(item.productId, item.size);
      } else if (p.stock <= 0) {
        outOfStock.push(item);
        removeFromCart(item.productId, item.size);
      }
    }

    if (removed.length > 0 || outOfStock.length > 0) {
      const messages: string[] = [];
      if (removed.length > 0) messages.push("some products were removed because they were deleted by the admin");
      if (outOfStock.length > 0) messages.push("some products went out of stock and were removed from your cart");
      toast({ title: "Cart updated", description: messages.join(" and "), variant: "destructive" });
      // reload local state
      setCartItems(getCart());
    }
  }, [products]);

  const handleQuantityChange = (productId: string, size: string, delta: number) => {
    const item = cartItems.find(i => i.productId === productId && i.size === size);
    if (item) {
      updateCartItemQuantity(productId, size, item.quantity + delta);
    }
  };

  const handleRemove = (productId: string, size: string) => {
    removeFromCart(productId, size);
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const whatsappUrl = generateCartWhatsAppLink(cartItems);
    window.open(whatsappUrl, "_blank");
  };

  const total = getCartTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-6 py-12">
          <ShoppingCart className="h-24 w-24 text-[#666666] mx-auto" />
          <h2 className="text-2xl font-bold text-ui-text" data-testid="text-empty-cart">
            Your cart is empty
          </h2>
          <p className="text-[#666666]">
            Add some products to get started
          </p>
          <Link href="/shop">
            <Button 
              className="bg-brand-navy text-white hover:bg-[#0B2458]" 
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 bg-white">
      <h1 className="text-2xl font-semibold mb-6 text-ui-text" data-testid="text-cart-title">
        Cart
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center gap-4 border border-ui-border rounded-lg p-4 bg-white"
              data-testid={`cart-item-${item.productId}-${item.size}`}
            >
              <Link href={`/product/${item.productId}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer"
                />
              </Link>
              <div className="flex-1">
                <Link href={`/product/${item.productId}`}>
                  <h3 className="font-medium text-ui-text hover:underline cursor-pointer">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-sm text-[#666] mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-ui-text">₹{item.price * item.quantity}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-ui-border"
                    onClick={() => handleQuantityChange(item.productId, item.size, -1)}
                    disabled={item.quantity <= 1}
                    data-testid={`button-decrease-${item.productId}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span
                    className="text-sm font-medium w-8 text-center"
                    data-testid={`text-quantity-${item.productId}`}
                  >
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-ui-border"
                    onClick={() => handleQuantityChange(item.productId, item.size, 1)}
                    data-testid={`button-increase-${item.productId}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleRemove(item.productId, item.size)}
                    data-testid={`button-remove-${item.productId}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white border border-ui-border rounded-xl p-6 sticky top-24 h-fit">
          <h3 className="font-semibold mb-4 text-ui-text">Summary</h3>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-[#666666]">Subtotal</span>
            <span className="font-medium text-ui-text">₹{total}</span>
          </div>
          <div className="flex justify-between py-2 text-sm text-[#666666]">
            <span>Total Items</span>
            <span>{itemCount}</span>
          </div>
          <div className="mt-6">
            <Button
              size="lg"
              className="w-full bg-brand-green hover:bg-brand-green-100 text-white"
              onClick={handleWhatsAppCheckout}
              data-testid="button-checkout-whatsapp"
            >
              <FaWhatsapp className="mr-2 h-5 w-5" />
              Checkout on WhatsApp
            </Button>
          </div>
          <Link href="/shop">
            <Button 
              variant="outline" 
              className="w-full mt-3 border border-ui-border text-ui-text hover:bg-ui-bg-soft" 
              data-testid="button-continue-shopping"
            >
              Continue Shopping
            </Button>
          </Link>
        </aside>
      </div>
    </main>
  );
}
