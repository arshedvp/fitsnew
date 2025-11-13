import { CartItem } from "@shared/schema";

const CART_STORAGE_KEY = "fitsnew_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: Omit<CartItem, "quantity"> & { quantity?: number }): void {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (i) => i.productId === item.productId && i.size === item.size
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }

  saveCart(cart);
}

export function updateCartItemQuantity(
  productId: string,
  size: string,
  quantity: number
): void {
  const cart = getCart();
  const index = cart.findIndex(
    (i) => i.productId === productId && i.size === size
  );

  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    saveCart(cart);
  }
}

export function removeFromCart(productId: string, size: string): void {
  const cart = getCart();
  const filtered = cart.filter(
    (i) => !(i.productId === productId && i.size === size)
  );
  saveCart(filtered);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}
