'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const stylistFormSchema = z.object({
  skinType: z.string().min(1, { message: 'Please select your skin type.' }),
  preferences: z.string().min(10, { message: 'Please describe your preferences in at least 10 characters.' }),
});

export default function StylistPage() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof stylistFormSchema>>({
    resolver: zodResolver(stylistFormSchema),
    defaultValues: {
      skinType: '',
      preferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof stylistFormSchema>) {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const result = await getPersonalizedRecommendations(values);
      setRecommendations(result.recommendations);
    } catch (err) {
      setError('Sorry, our AI stylist is taking a break. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">AI Personal Stylist</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          Let our AI analyze your needs and curate a personalized list of makeup recommendations just for you.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Tell Us About You</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="skinType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skin Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your skin type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="oily">Oily</SelectItem>
                          <SelectItem value="dry">Dry</SelectItem>
                          <SelectItem value="combination">Combination</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="sensitive">Sensitive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Makeup Preferences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I love a natural look, bold red lips, warm tones, shimmery eyeshadows..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Thinking...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Get Recommendations</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col">
          {isLoading && (
             <Card className="flex-grow flex flex-col items-center justify-center p-6">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="mt-4 text-muted-foreground">Our AI is curating your perfect look...</p>
             </Card>
          )}
          
          {!isLoading && recommendations.length > 0 && (
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle className="font-headline">Your Personalized Recommendations</CardTitle>
                <CardDescription>Based on your input, here are some products you might love!</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 list-disc list-inside">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-foreground">{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

           {!isLoading && error && (
            <Alert variant="destructive" className="flex-grow">
              <AlertTitle>Oh no!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && recommendations.length === 0 && !error && (
             <Card className="flex-grow flex flex-col items-center justify-center p-6 bg-secondary/30 border-dashed">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">Your recommendations will appear here.</p>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
