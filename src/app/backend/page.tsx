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
import { Loader2, Cpu, Database, BrainCircuit } from 'lucide-react';
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
      query: 'What is the most popular product category?',
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
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <Cpu className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl font-headline font-bold tracking-tight md:text-5xl">
            3-Tier Architecture in Action
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            This page demonstrates a modern, serverless 3-tier architecture. Your request flows from the client to a secure backend service, which queries a database and uses AI for analysis.
          </p>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-headline font-semibold">Send a Query</h2>
                  <p className="text-muted-foreground mt-1">Ask a question about the product data.</p>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                      <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Query</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., What is the average product price?"
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
                </div>

                <div className="flex flex-col">
                    <h2 className="text-2xl font-headline font-semibold">Backend Response</h2>
                    <p className="text-muted-foreground mt-1">The AI-powered answer from the service layer.</p>
                    <div className="mt-6 flex-grow">
                         {isLoading && (
                            <Card className="flex-grow flex flex-col items-center justify-center p-6 border-dashed h-full">
                                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                                <p className="mt-4 text-muted-foreground">Processing in the application tier...</p>
                            </Card>
                        )}
                        
                        {!isLoading && response && (
                            <Card className="flex-grow bg-secondary/30">
                            <CardContent className="p-6">
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
                            <Card className="flex-grow flex flex-col items-center justify-center p-6 bg-secondary/30 border-dashed h-full">
                                <Cpu className="h-10 w-10 text-muted-foreground" />
                                <p className="mt-4 text-center text-muted-foreground">The response will appear here.</p>
                            </Card>
                        )}
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-10 text-center">
            <h3 className="text-xl font-headline font-semibold">How it Works</h3>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <BrainCircuit className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold">1. Presentation Tier</h4>
                    <p className="text-sm text-muted-foreground mt-1">You are here. This Next.js & React frontend is what you see and interact with.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Cpu className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold">2. Application Tier</h4>
                    <p className="text-sm text-muted-foreground mt-1">A Genkit flow on the server securely receives your query, retrieves data from Firestore, and uses the Gemini API for analysis.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Database className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold">3. Data Tier</h4>
                    <p className="text-sm text-muted-foreground mt-1">A secure Firebase Firestore database stores the product information, which is accessed only by the application tier.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
