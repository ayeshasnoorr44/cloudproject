'use server';
/**
 * @fileOverview A generic service layer flow for handling backend logic.
 *
 * - processQuery - A function that takes a user query and returns a processed response.
 * - ServiceLayerInput - The input type for the processQuery function.
 * - ServiceLayerOutput - The return type for the processQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { products } from '@/lib/products';

const ServiceLayerInputSchema = z.object({
  query: z.string().describe('A user query about product data.'),
});
export type ServiceLayerInput = z.infer<typeof ServiceLayerInputSchema>;

const ServiceLayerOutputSchema = z.object({
  response: z.string().describe('The AI-powered response to the query.'),
});
export type ServiceLayerOutput = z.infer<typeof ServiceLayerOutputSchema>;

export async function processQuery(
  input: ServiceLayerInput
): Promise<ServiceLayerOutput> {
  return serviceLayerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'serviceLayerPrompt',
  input: {schema: ServiceLayerInputSchema.extend({ productData: z.string() })},
  output: {schema: ServiceLayerOutputSchema},
  prompt: `You are a sophisticated backend assistant. Your role is to analyze product data and answer user queries with intelligence and accuracy.

  Here is the product data retrieved from the database:
  \`\`\`json
  {{{productData}}}
  \`\`\`
  
  Now, answer the following user query based on the data provided.
  Query: {{{query}}}
`,
  model: 'googleai/gemini-1.5-pro-latest',
});

const serviceLayerFlow = ai.defineFlow(
  {
    name: 'serviceLayerFlow',
    inputSchema: ServiceLayerInputSchema,
    outputSchema: ServiceLayerOutputSchema,
  },
  async input => {
    // In a real app, this data would be fetched from Firestore.
    // We are using the local product data for this simulation.
    const productData = JSON.stringify(products, null, 2);

    const {output} = await prompt({...input, productData});
    return output!;
  }
);
