'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Order Placed! (Simulation)",
        description: "Thank you for your purchase. Your order has been successfully simulated.",
    });
    dispatch({ type: 'SET_STATE', payload: { cart: [] } });
    router.push('/products');
  };

  if (cart.length === 0) {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-headline font-bold">Your cart is empty.</h1>
            <p className="mt-2 text-muted-foreground">Add items to your cart to proceed to checkout.</p>
            <Button asChild className="mt-6">
                <Link href="/products">Return to Shop</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/cart"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart</Link>
      </Button>
      <h1 className="text-4xl font-headline font-bold mb-8">Checkout</h1>
      <form className="grid lg:grid-cols-3 gap-8" onSubmit={handlePlaceOrder}>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="1234 Main St" required />
                    </div>
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="San Francisco" required />
                    </div>
                    <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="94103" required />
                    </div>
                </CardContent>
            </Card>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Payment Details (Simulation)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <CreditCard className="absolute left-3 top-9 h-5 w-5 text-muted-foreground" />
                        <Input id="cardNumber" placeholder="**** **** **** 1234" className="pl-10" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center">
                            <span className="text-muted-foreground">{item.product.name} x {item.quantity}</span>
                            <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <Separator className="my-4"/>
              <div className="space-y-2">
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
              </div>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full mt-6">
            <Lock className="mr-2 h-4 w-4" /> Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
