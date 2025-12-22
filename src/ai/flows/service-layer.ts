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

const ServiceLayerInputSchema = z.object({
  query: z.string().describe('A user query.'),
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
  input: {schema: ServiceLayerInputSchema},
  output: {schema: ServiceLayerOutputSchema},
  prompt: `You are a helpful backend assistant. Process the following query and provide a response.
Query: {{{query}}}
`,
});

const serviceLayerFlow = ai.defineFlow(
  {
    name: 'serviceLayerFlow',
    inputSchema: ServiceLayerInputSchema,
    outputSchema: ServiceLayerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
