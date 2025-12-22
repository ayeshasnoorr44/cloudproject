import { products } from '@/lib/products';
import { ProductFilters } from '@/components/product/product-filters';

export const metadata = {
  title: 'All Products | Glamify',
  description: 'Explore our curated collection of premium lipsticks and eyeshadows from top brands.',
};

export default function ProductsPage() {
  // In a real app, you'd fetch this data. For now, we import it.
  const allProducts = products;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Product Collection</h1>
        <p className="mt-2 text-lg text-muted-foreground">Only the best, 4+ star rated products from world-class brands.</p>
      </div>
      <ProductFilters allProducts={allProducts} />
    </div>
  );
}
