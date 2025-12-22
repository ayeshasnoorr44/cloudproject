'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { cart, dispatch } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-8 text-4xl font-headline font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-headline font-bold mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <Card key={item.id} className="flex items-center p-4">
              <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  data-ai-hint={item.product.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.selectedColor.hex }} />
                  <span className="text-sm text-muted-foreground">{item.selectedColor.name}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center border rounded-md">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <p className="w-20 text-right font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleRemoveItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tax (8%)</p>
                <p className="font-semibold">${tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
