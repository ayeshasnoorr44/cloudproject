import Link from "next/link";
import { Sparkles, Twitter, Instagram, Facebook } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-headline">Glamify</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Discover your perfect shade with our AI-powered virtual try-on and curated collection of premium makeup.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=Lipstick" className="text-sm text-muted-foreground hover:text-primary">Lipsticks</Link></li>
              <li><Link href="/products?category=Eyeshadow" className="text-sm text-muted-foreground hover:text-primary">Eyeshadows</Link></li>
              <li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary">All Products</Link></li>
              <li><Link href="/brands" className="text-sm text-muted-foreground hover:text-primary">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              <li><Link href="/try-on" className="text-sm text-muted-foreground hover:text-primary">Virtual Try-On</Link></li>
              <li><Link href="/stylist" className="text-sm text-muted-foreground hover:text-primary">AI Stylist</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {year} Glamify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
