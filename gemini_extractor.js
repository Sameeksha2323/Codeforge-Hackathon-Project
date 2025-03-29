/**
 * Gemini API integration for filtering OCR text
 */

const GEMINI_API_KEY = 'AIzaSyA4ANGZ6cHuipZSxMfcFlwfyj2OAmVgGJ0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

/**
 * Filters OCR text using Gemini API
 * @param {string} text - Raw OCR text
 * @returns {Promise<Object>} - Filtered medicine details
 */
export async function filterOCRText(text) {
    try {
        const prompt = `Extract the following medicine details from the given text:
        - Medicine Name: Look for the main medicine name (e.g., "Everolimus Tablets")
        - Batch Number: Look for "BATCH NO" or "BATCH" followed by a number/letter combination
        - Manufacturing Date: Look for "MFG.DATE" or "MFG" followed by a date
        - Expiry Date: Look for "EXP.DATE" or "EXP" followed by a date
        - Ingredients: Look for "contains" followed by ingredients
        
        Text: ${text}
        
        Return ONLY a JSON object with these exact keys, no markdown formatting or additional text:
        {
            "medicineName": "",
            "batchNumber": "",
            "manufacturingDate": "",
            "expiryDate": "",
            "ingredients": ""
        }
        
        If any information is not found, leave that field empty.
        Dates should be in DD/MM/YYYY format.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 0.8,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error response:', errorText);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Gemini API response:', data);
        
        // Extract the text from the response
        let responseText = data.candidates[0].content.parts[0].text;
        
        // Remove markdown code block formatting if present
        responseText = responseText.replace(/```json\n?/, '').replace(/```\n?/, '');
        
        // Parse the cleaned JSON
        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);
        
        return {
            ...result,
            rawText: text
        };
    } catch (error) {
        console.error('Error filtering text with Gemini API:', error);
        // Return empty result if Gemini API fails
        return {
            medicineName: '',
            batchNumber: '',
            manufacturingDate: '',
            expiryDate: '',
            ingredients: '',
            rawText: text
        };
    }
} 