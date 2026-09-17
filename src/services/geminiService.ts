/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const getSafetyAdvice = async (peakName: string, altitude: number, symptoms: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise safety assessment for climbing ${peakName} at ${altitude}m. 
      The climber is experiencing: ${symptoms.length > 0 ? symptoms.join(', ') : 'no symptoms'}.
      Include specific advice on AMS (Acute Mountain Sickness) risk, hydration, and when to descend.
      Format the response in Markdown with clear headings.`,
      config: {
        systemInstruction: "You are an expert high-altitude mountaineering safety advisor. Your goal is to provide life-saving advice to climbers. Be direct, professional, and prioritize safety above all else. If symptoms are severe, strongly advise immediate descent.",
      },
    });

    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The safety advisor is currently offline. Please consult local mountain guides and follow standard safety protocols.";
  }
};
