import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { products } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const featuredProducts = products.filter(p => p.rating >= 4.8).slice(0, 8);
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 p-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-white drop-shadow-lg">
            Discover Your Perfect Shade
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-white/90">
            Virtually try on premium makeup from the world's top brands. Find your match before you buy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/products">Shop All Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white hover:text-black">
              <Link href="/try-on">Virtual Try-On <Sparkles className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center mb-10">Featured Collection</h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-headline font-bold">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">Explore our curated selection of high-end makeup.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products?category=Lipstick" className="group">
              <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <CardContent className="p-0 relative h-64">
                   <Image src="https://picsum.photos/seed/lipstick-category/600/400" data-ai-hint="lipstick texture" alt="Lipstick category" fill className="object-cover" />
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                     <h3 className="text-3xl font-headline text-white">Lipsticks</h3>
                   </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/products?category=Eyeshadow" className="group">
              <Card className="overflow-hidden h-full transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                 <CardContent className="p-0 relative h-64">
                   <Image src="https://picsum.photos/seed/eyeshadow-category/600/400" data-ai-hint="eyeshadow palette" alt="Eyeshadow category" fill className="object-cover" />
                   <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                     <h3 className="text-3xl font-headline text-white">Eyeshadows</h3>
                   </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-card">
        <div className="container mx-auto px-4 text-center">
           <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
           <h2 className="text-3xl font-headline font-bold">Personalized AI Stylist</h2>
           <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
             Answer a few questions and let our AI find the perfect products for your skin type and style preferences.
           </p>
           <Button asChild size="lg" className="mt-6">
             <Link href="/stylist">Find My Style <ArrowRight className="ml-2 h-5 w-5" /></Link>
           </Button>
        </div>
      </section>
    </div>
  );
}
