import { CartItem } from "@shared/schema";

const WHATSAPP_NUMBER = "918606721229";

export function generateProductWhatsAppLink(
  productId: string,
  productName: string,
  price: number,
  size: string,
  productUrl: string
): string {
  const message = `Hello, I want to order this product from FitsNew:

Product: ${productName}
Price: ₹${price}
Size: ${size}
Quantity: 1
Product ID: ${productId}
Product Link: ${productUrl}

Please confirm availability.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function generateCartWhatsAppLink(cartItems: CartItem[]): string {
  const itemsList = cartItems
    .map(
      (item, index) =>
        `${index + 1}) ${item.title}
   Size: ${item.size}
   Qty: ${item.quantity}
   Price: ₹${item.price * item.quantity}`
    )
    .join("\n\n");

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const message = `Hello, I want to place an order from FitsNew:

${itemsList}

Total Items: ${totalItems}
Grand Total: ₹${grandTotal}

Please confirm product availability.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
