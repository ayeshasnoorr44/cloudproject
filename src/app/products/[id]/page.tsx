import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductDetails } from '@/components/product/product-details';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: ProductPageProps) {
  const product = products.find(p => p.id === params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} | Glamify`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}
