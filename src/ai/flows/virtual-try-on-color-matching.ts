'use server';
/**
 * @fileOverview Implements the virtual try-on color matching flow.
 *
 * - virtualTryOnColorMatch - A function that handles the virtual try-on color matching process.
 * - VirtualTryOnColorMatchInput - The input type for the virtualTryOnColorMatch function.
 * - VirtualTryOnColorMatchOutput - The return type for the virtualTryOnColorMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VirtualTryOnColorMatchInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productColorHex: z.string().describe('The HEX color code of the makeup product to try on.'),
  skinToneDescription: z.string().optional().describe('Optional description of the user skin tone.'),
});
export type VirtualTryOnColorMatchInput = z.infer<typeof VirtualTryOnColorMatchInputSchema>;

const VirtualTryOnColorMatchOutputSchema = z.object({
  modifiedPhotoDataUri: z
    .string()
    .describe(
      'The modified photo with the makeup product virtually applied, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' +
        'If the try on fails, the original photo will be returned. If the function cannot determine a good color match, it will return null.'
    ),
  matchingLipstickColorHex: z.string().optional().describe('The modified HEX color code of the lipstick matched to the skin tone.'),
});
export type VirtualTryOnColorMatchOutput = z.infer<typeof VirtualTryOnColorMatchOutputSchema>;

export async function virtualTryOnColorMatch(
  input: VirtualTryOnColorMatchInput
): Promise<VirtualTryOnColorMatchOutput> {
  return virtualTryOnColorMatchFlow(input);
}

const virtualTryOnColorMatchPrompt = ai.definePrompt({
  name: 'virtualTryOnColorMatchPrompt',
  input: {schema: VirtualTryOnColorMatchInputSchema},
  output: {schema: VirtualTryOnColorMatchOutputSchema},
  prompt: `You are a virtual makeup artist that is able to virtually apply makeup to user photos.

  First, analyze the user's skin tone from the photo, taking into account any skin tone description they may have provided.
  Then, using the desired makeup color ({{{productColorHex}}}), create a modified photo with that makeup color applied to the lips of the user in the photo.

  Return a data URI of the same MIME type and encoding as the input photo, but with the makeup virtually applied.
  You must fill in modifiedPhotoDataUri, and set matchingLipstickColorHex to the hex code of the applied lipstick.

  Photo: {{media url=photoDataUri}}
  {
    "modifiedPhotoDataUri": "data:image/png;base64,<b64_encoded_generated_image>",
    "matchingLipstickColorHex": "#C21E56"
  }
  `,
});

const virtualTryOnColorMatchFlow = ai.defineFlow(
  {
    name: 'virtualTryOnColorMatchFlow',
    inputSchema: VirtualTryOnColorMatchInputSchema,
    outputSchema: VirtualTryOnColorMatchOutputSchema,
  },
  async input => {
    try {
      const {output} = await virtualTryOnColorMatchPrompt(input);
      return output!;
    } catch (e: any) {
      console.error('Virtual try on failed: ' + e.message);
      // If try on fails, return the original image.
      return {
        modifiedPhotoDataUri: input.photoDataUri,
        matchingLipstickColorHex: input.productColorHex,
      };
    }
  }
);
