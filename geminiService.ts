
import { GoogleGenAI, Type } from "@google/genai";
import { CRITICAL_SKILLS_LIST_SUMMARY } from "./constants";
import { MatchResult, NQFLevel } from "./types";

const getNQFDescription = (level: NQFLevel) => {
  switch (level) {
    case NQFLevel.LEVEL_10: return "NQF Level 10 (Doctoral Degree)";
    case NQFLevel.LEVEL_9: return "NQF Level 9 (Master's Degree)";
    case NQFLevel.LEVEL_8: return "NQF Level 8 (Honours Degree / Post Grad Diploma)";
    case NQFLevel.LEVEL_7: return "NQF Level 7 (Bachelor's Degree / Advanced Diploma)";
    case NQFLevel.LEVEL_6: return "NQF Level 6 (Diploma / National Higher Certificate)";
    default: return "Below NQF Level 6";
  }
};

export const matchOccupationWithAI = async (jobTitle: string, nqfLevel: NQFLevel): Promise<MatchResult> => {
  try {
    // The API key must be obtained exclusively from process.env.API_KEY
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing in the environment.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const nqfDesc = getNQFDescription(nqfLevel);
    const userNQFValue = nqfLevel === NQFLevel.OTHER ? 0 : parseInt(nqfLevel);
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a South African Immigration Specialist. Determine if the following job title and qualification level match any occupation on the South African Critical Skills List (gazetted Oct 2023).
      
      APPLICANT PROFILE:
      - Job Title: "${jobTitle}"
      - Qualification: "${nqfDesc}" (Numeric Level: ${userNQFValue})
      
      OFFICIAL CRITICAL SKILLS LIST DATA (OFO 2021):
      ${CRITICAL_SKILLS_LIST_SUMMARY}
      
      STRICT VERIFICATION RULES:
      1. COMPARE the Applicant's Job Title against the list.
      2. COMPARE the Numeric NQF Level (${userNQFValue}) against the "Min NQF" value in the list for that specific skill.
      3. MATCH TYPE: 
         - 'FULL': Precise semantic match for job title AND (Applicant NQF >= Min NQF).
         - 'PARTIAL': Precise semantic match for job title BUT (Applicant NQF < Min NQF).
         - 'NONE': No reasonable semantic match for the job title.
      4. OFO CODE: Extract the exact code from the list provided (e.g., 2021-251201).
      5. isNQFValid: Boolean. True only if Applicant Numeric Level >= Min NQF required.
      
      Respond ONLY with a JSON object.`,
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
            ofoCode: { type: Type.STRING, description: "The 6-digit OFO 2021 code" },
            confidence: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            isNQFValid: { type: Type.BOOLEAN },
            minNQFRequired: { type: Type.STRING }
          },
          required: ["matchType", "officialOccupation", "confidence", "reason", "isNQFValid", "ofoCode"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("The model returned an empty response.");
    
    // Safety: Extract JSON string even if model wraps it in markdown blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(jsonStr) as MatchResult;
  } catch (error: any) {
    console.error("AI matching error:", error);
    return {
      matchType: 'NONE',
      officialOccupation: "",
      confidence: 0,
      reason: `Matching failed: ${error.message || "Please ensure your API Key is correctly configured."}`,
      isNQFValid: false
    };
  }
};
