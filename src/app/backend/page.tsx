'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { processQuery } from '@/ai/flows/service-layer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Cpu } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const backendFormSchema = z.object({
  query: z.string().min(2, { message: 'Please enter a query of at least 2 characters.' }),
});

export default function BackendPage() {
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof backendFormSchema>>({
    resolver: zodResolver(backendFormSchema),
    defaultValues: {
      query: '',
    },
  });

  async function onSubmit(values: z.infer<typeof backendFormSchema>) {
    setIsLoading(true);
    setError(null);
    setResponse('');
    try {
      const result = await processQuery(values);
      setResponse(result.response);
    } catch (err) {
      setError('An error occurred while processing your query. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <Cpu className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-headline font-bold">3-Tier Backend Service</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-muted-foreground">
          This page demonstrates a simple 3-tier architecture. The form below sends a query to a Genkit flow (application layer) which uses the Gemini API.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Send a Query</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Query</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., What is a 3-tier architecture?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : (
                    <>Send to Backend</>
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
                <p className="mt-4 text-muted-foreground">Processing in the application tier...</p>
             </Card>
          )}
          
          {!isLoading && response && (
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle className="font-headline">Backend Response</CardTitle>
                <CardDescription>This is the response from the Gemini-powered service layer.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{response}</p>
              </CardContent>
            </Card>
          )}

           {!isLoading && error && (
            <Alert variant="destructive" className="flex-grow">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !response && !error && (
             <Card className="flex-grow flex flex-col items-center justify-center p-6 bg-secondary/30 border-dashed">
                <Cpu className="h-10 w-10 text-muted-foreground" />
                <p className="mt-4 text-center text-muted-foreground">The response from the backend will appear here.</p>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
