import type { Product } from '@/lib/products';
import { ProductCard } from './product-card';

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">No Products Found</h2>
        <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
