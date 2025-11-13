import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaWhatsapp } from "react-icons/fa";
import { getCart, updateCartItemQuantity, removeFromCart, getCartTotal } from "@/lib/cart";
import { generateCartWhatsAppLink } from "@/lib/whatsapp";
import { CartItem } from "@shared/schema";

export function CartDrawer() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-open-cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span data-testid="text-cart-title">Shopping Cart ({itemCount})</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              data-testid="button-close-cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium" data-testid="text-empty-cart">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Add some products to get started
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex gap-4 p-4 border rounded-md"
                data-testid={`cart-item-${item.productId}-${item.size}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium line-clamp-1">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Size: {item.size}
                    </Badge>
                    <span className="text-sm font-semibold">₹{item.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
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
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.productId, item.size, 1)}
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
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
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="space-y-2">
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
            <div className="flex justify-between text-lg font-bold">
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
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
