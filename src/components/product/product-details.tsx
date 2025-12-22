'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product, ProductColor } from '@/lib/products';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StarRating } from './star-rating';
import { ColorSwatch } from './color-swatch';
import { Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import { ProductCard } from './product-card';

type ProductDetailsProps = {
  product: Product;
  relatedProducts: Product[];
};

export function ProductDetails({ product, relatedProducts }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, quantity);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            data-ai-hint={product.imageHint}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-sm font-medium text-primary">{product.brand}</span>
          <h1 className="text-4xl font-headline font-bold">{product.name}</h1>
          <div className="flex items-center gap-4">
            <StarRating rating={product.rating} starClassName="h-5 w-5" />
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          
          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Color: <span className="font-bold">{selectedColor.name}</span></h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <ColorSwatch
                  key={color.hex}
                  color={color}
                  isSelected={selectedColor.hex === color.hex}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-grow">
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
          </div>

          <div className="border rounded-lg p-4 flex items-start gap-4 mt-4 bg-secondary/30">
            <Truck className="h-6 w-6 text-primary mt-1" />
            <div>
              <h4 className="font-semibold">Free Shipping & Returns</h4>
              <p className="text-sm text-muted-foreground">Get free shipping on all orders over $50.</p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-headline font-bold text-center mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
