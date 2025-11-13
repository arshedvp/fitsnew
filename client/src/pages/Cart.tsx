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

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 py-12">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold" data-testid="text-empty-cart">
            Your cart is empty
          </h2>
          <p className="text-muted-foreground">
            Add some products to get started
          </p>
          <Link href="/shop">
            <Button size="lg" data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8" data-testid="text-cart-title">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card
                key={`${item.productId}-${item.size}`}
                data-testid={`cart-item-${item.productId}-${item.size}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-4">
                    <Link href={`/product/${item.productId}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md cursor-pointer hover-elevate"
                      />
                    </Link>
                    <div className="flex-1 space-y-3">
                      <div>
                        <Link href={`/product/${item.productId}`}>
                          <h3 className="font-semibold text-lg hover:underline cursor-pointer">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">Size: {item.size}</Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.productId, item.size, -1)}
                            disabled={item.quantity <= 1}
                            data-testid={`button-decrease-${item.productId}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span
                            className="text-lg font-medium w-12 text-center"
                            data-testid={`text-quantity-${item.productId}`}
                          >
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.productId, item.size, 1)}
                            data-testid={`button-increase-${item.productId}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold">
                            ₹{item.price * item.quantity}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleRemove(item.productId, item.size)}
                            data-testid={`button-remove-${item.productId}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Items</span>
                    <span>{itemCount}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span data-testid="text-cart-total">₹{total}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleWhatsAppCheckout}
                  data-testid="button-checkout-whatsapp"
                >
                  <FaWhatsapp className="mr-2 h-5 w-5" />
                  Checkout on WhatsApp
                </Button>
                <Link href="/shop">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
