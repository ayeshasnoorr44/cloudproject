'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { virtualTryOnColorMatch } from '@/ai/flows/virtual-try-on-color-matching';
import { products } from '@/lib/products';
import type { Product, ProductColor } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Upload, Wand2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const lipstickProducts = products.filter(p => p.category === 'Lipstick');

export default function TryOnPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [modifiedImage, setModifiedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setModifiedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTryOn = async () => {
    if (!uploadedImage || !selectedColor) {
      toast({
        variant: "destructive",
        title: "Missing selection",
        description: "Please upload a photo and select a product color.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await virtualTryOnColorMatch({
        photoDataUri: uploadedImage,
        productColorHex: selectedColor.hex,
      });
      setModifiedImage(result.modifiedPhotoDataUri);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not apply the virtual try-on. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setModifiedImage(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <Wand2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">Virtual Try-On</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Upload a photo of yourself and select a product to see how it looks. It's magic!
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="aspect-square w-full relative flex items-center justify-center border-dashed">
            {uploadedImage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                    <div className="relative">
                        <Image src={uploadedImage} alt="Uploaded user photo" fill className="object-contain" />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</div>
                    </div>
                     <div className="relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 z-10">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="mt-4 text-muted-foreground">Applying makeup...</p>
                            </div>
                        ) : modifiedImage ? (
                            <>
                                <Image src={modifiedImage} alt="Photo with makeup applied" fill className="object-contain" />
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Try-On</div>
                            </>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <Wand2 className="h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-muted-foreground">Your try-on result will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Upload a clear, front-facing photo.</p>
                <Button onClick={() => fileInputRef.current?.click()} className="mt-4">
                  Choose File
                </Button>
              </div>
            )}
             {uploadedImage && (
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-20 h-8 w-8" onClick={clearImage}>
                    <X className="h-4 w-4" />
                </Button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg"
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Select a Product</h2>
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-4 space-y-4">
                {lipstickProducts.map(product => (
                  <div key={product.id}>
                    <button
                      className="text-left w-full"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </button>
                    {selectedProduct?.id === product.id && (
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {product.colors.map(color => (
                          <button
                            key={color.hex}
                            onClick={() => setSelectedColor(color)}
                            className={`h-10 w-10 rounded-md border-2 ${selectedColor?.hex === color.hex ? 'border-primary' : 'border-transparent'}`}
                            style={{ backgroundColor: color.hex }}
                            aria-label={color.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t mt-auto">
              <Button onClick={handleTryOn} disabled={!uploadedImage || !selectedColor || isLoading} className="w-full" size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Apply Makeup
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
