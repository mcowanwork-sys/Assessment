
import { GoogleGenAI, Type } from "@google/genai";
import { CRITICAL_SKILLS_LIST_SUMMARY } from "./constants";
import { MatchResult, NQFLevel } from "./types";

const getNQFDescription = (level: NQFLevel) => {
  switch (level) {
    case NQFLevel.LEVEL_9_10: return "NQF Level 9 or 10 (Master's or Doctorate)";
    case NQFLevel.LEVEL_7_8: return "NQF Level 7 or 8 (Bachelor's or Honours)";
    default: return "Below NQF Level 7 (Diploma or lower)";
  }
};

export const matchOccupationWithAI = async (jobTitle: string, nqfLevel: NQFLevel): Promise<MatchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const nqfDesc = getNQFDescription(nqfLevel);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a South African Immigration Specialist. Determine if the following job title and qualification level match any occupation on the South African Critical Skills List (gazetted Oct 2023).
      
      User Job Title: ${jobTitle}
      User Qualification Level: ${nqfDesc}
      
      OFFICIAL CRITICAL SKILLS LIST DATA (OFO 2021):
      ${CRITICAL_SKILLS_LIST_SUMMARY}
      
      STRICT VERIFICATION RULES:
      1. MATCH TYPE: 
         - 'FULL': The job title corresponds clearly to a category in the list AND the user's NQF level meets or exceeds the specified 'Min NQF' requirement for that code.
         - 'PARTIAL': The job title matches a category, but the user's NQF level is below the gazetted minimum (e.g., they have NQF 6 but the skill requires NQF 8).
         - 'NONE': No reasonable match found.
      2. OFO CODE: You MUST extract and provide the exact 6-digit OFO 2021 code provided in the list above (e.g., 2021-251201). DO NOT GUESS OR USE OLD CODES.
      3. REASON: Cite the exact OFO code and mention the NQF requirement from the list provided.
      4. NQF VALIDATION: Set 'isNQFValid' to true only if the user's level is equal to or higher than the 'Min NQF' for that specific occupation.
      
      Respond only with a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchType: { 
              type: Type.STRING, 
              description: "Must be 'FULL', 'PARTIAL', or 'NONE'" 
            },
            officialOccupation: { type: Type.STRING },
            ofoCode: { type: Type.STRING, description: "6-digit OFO 2021 code from provided list" },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            isNQFValid: { type: Type.BOOLEAN },
            minNQFRequired: { type: Type.STRING }
          },
          required: ["matchType", "officialOccupation", "confidence", "reason", "isNQFValid", "ofoCode"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}") as MatchResult;
    return result;
  } catch (error) {
    console.error("AI matching error:", error);
    return {
      matchType: 'NONE',
      officialOccupation: "",
      confidence: 0,
      reason: "Error connecting to verification service.",
      isNQFValid: false
    };
  }
};
