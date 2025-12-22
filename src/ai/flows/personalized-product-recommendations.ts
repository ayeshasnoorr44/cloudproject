'use server';

/**
 * @fileOverview Provides personalized product recommendations based on user skin type and preferences.
 *
 * - getPersonalizedRecommendations - A function that takes user input and returns personalized product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  skinType: z.string().describe('The user\'s skin type (e.g., oily, dry, combination).'),
  preferences: z.string().describe('The user\'s makeup preferences (e.g., natural, bold, specific colors).'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('A list of personalized makeup product recommendations.')
  ).describe('The AI-powered makeup product recommendations based on user input.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a personal makeup assistant. Based on the user's skin type and makeup preferences, provide a list of personalized product recommendations.

Skin Type: {{{skinType}}}
Preferences: {{{preferences}}}

Recommendations:
`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
