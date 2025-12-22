import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from './star-rating';
import { Badge } from '@/components/ui/badge';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="aspect-square relative w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              data-ai-hint={product.imageHint}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
          <CardTitle className="text-lg font-body font-bold leading-tight tracking-normal">
            {product.name}
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex flex-col">
            <StarRating rating={product.rating} />
            <p className="text-lg font-semibold mt-1">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
