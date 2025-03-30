/**
 * OCR API processing utilities
 */

// API configuration
const API_CONFIG = {
    endpoint: 'https://api.ocr.space/parse/image',
    apiKey: 'K83805636688957', // Hardcoded for now since we're in browser
    options: {
        language: 'eng',
        isOverlayRequired: false,
        scale: true,
        OCREngine: 2,
        detectOrientation: true
    }
};

// Supabase configuration
const SUPABASE_URL = 'https://tdsyjqengadsijidncfd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkc3lqcWVuZ2Fkc2lqaWRuY2ZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwODEwNDQsImV4cCI6MjA1ODY1NzA0NH0.PKKbdRlvZR9lPzw7XY1PlyvveSzJ2J8xFGgWzXxC19E';

// Rate limiting configuration
const RATE_LIMIT = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    maxRequestsPerMinute: 30
};

let requestCount = 0;
let lastRequestTime = Date.now();

// Add caching configuration
const CACHE_CONFIG = {
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

// Cache for OCR results
const ocrCache = new Map();

/**
 * Processes an image through OCR API with retry logic
 * @param {File|string} imageData - Image file or URL to process
 * @param {number} medicineId - ID from donated_meds table
 * @returns {Promise<Object>} - OCR API response
 */
export async function processImage(imageData, medicineId) {
    if (!imageData) {
        throw new Error('No image data provided');
    }

    if (!medicineId) {
        throw new Error('Medicine ID is required');
    }

    // Check cache first
    const cacheKey = typeof imageData === 'string' ? imageData : `${medicineId}_${imageData.name}`;
    if (CACHE_CONFIG.enabled && ocrCache.has(cacheKey)) {
        const cached = ocrCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_CONFIG.maxAge) {
            console.log('Using cached OCR result');
            return cached.data;
        }
    }

    // Check if input is a URL or File
    const isUrl = typeof imageData === 'string';
    
    if (isUrl) {
        // Validate URL
        try {
            const url = new URL(imageData);
            console.log('Processing URL:', url.toString());
            
            // Check if it's a supported image format
            const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
            const hasValidExtension = supportedFormats.some(format => 
                url.pathname.toLowerCase().endsWith(format)
            );
            
            if (!hasValidExtension) {
                throw new Error('URL must point to a supported image format (JPG, PNG, GIF, BMP, TIFF)');
            }
        } catch (e) {
            console.error('URL validation error:', e);
            throw new Error('Invalid URL provided. Please ensure it\'s a valid image URL.');
        }
    } else if (!imageData.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image file.');
    }

    const formData = createFormData(imageData, isUrl);
    
    try {
        console.log('Sending request to OCR.space...');
        const ocrResult = await makeRequest(formData);
        
        // Cache the result
        if (CACHE_CONFIG.enabled) {
            ocrCache.set(cacheKey, {
                data: ocrResult,
                timestamp: Date.now()
            });
        }
        
        // Store results in Supabase, but don't fail if it doesn't work
        const supabaseSuccess = await storeResultsInSupabase(ocrResult, medicineId);
        if (!supabaseSuccess) {
            console.warn('OCR results were not saved to Supabase, but the OCR was successful');
        }
        
        return ocrResult;
    } catch (error) {
        console.error('OCR processing error:', error);
        if (error.message.includes('rate limit')) {
            return await handleRateLimit(formData);
        }
        throw error;
    }
}

/**
 * Stores OCR results in Supabase
 * @param {Object} ocrResult - OCR API response
 * @param {number} medicineId - ID from donated_meds table
 */
async function storeResultsInSupabase(ocrResult, medicineId) {
    try {
        const rawText = ocrResult.ParsedResults[0].ParsedText;
        console.log('Attempting to update Supabase record:', medicineId);
        
        // First, check if the record exists
        const checkUrl = `${SUPABASE_URL}/rest/v1/donated_meds?id=eq.${medicineId}`;
        console.log('Checking record existence at:', checkUrl);
        
        const checkResponse = await fetch(checkUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!checkResponse.ok) {
            const errorText = await checkResponse.text();
            console.error('Supabase check error:', {
                status: checkResponse.status,
                statusText: checkResponse.statusText,
                error: errorText
            });
            throw new Error(`Failed to check record existence: ${checkResponse.status} ${checkResponse.statusText}`);
        }

        const existingRecords = await checkResponse.json();
        console.log('Existing records:', existingRecords);
        
        if (!existingRecords || existingRecords.length === 0) {
            throw new Error(`No record found with ID ${medicineId}`);
        }

        // Extract medicine details from the OCR text
        const medicineDetails = await extractMedicineDetails(rawText);
        console.log('Extracted medicine details:', medicineDetails);

        // Update the record in donated_meds table
        const updateUrl = `${SUPABASE_URL}/rest/v1/donated_meds?id=eq.${medicineId}`;
        console.log('Updating record at:', updateUrl);
        
        // Update with the extracted fields
        const response = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                medicine_name: medicineDetails.medicineName || null,
                quantity: parseInt(medicineDetails.quantity) || null,
                expiry_date: medicineDetails.expiryDate || null,
                ingredients: medicineDetails.ingredients || null
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Supabase update error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Failed to update Supabase: ${response.status} ${response.statusText} - ${errorText}`);
        }

        console.log('Successfully updated Supabase record');
        return true;
    } catch (error) {
        console.error('Error updating Supabase:', error);
        // Don't throw the error, just log it and continue
        // This way the OCR results will still be displayed even if Supabase update fails
        return false;
    }
}

/**
 * Extracts medicine details from OCR text using regex patterns as fallback
 * @param {string} text - Raw OCR text
 * @returns {Object} - Extracted medicine details
 */
function extractDetailsFromText(text) {
    const details = {
        medicineName: null,
        quantity: null,
        expiryDate: null,
        ingredients: null
    };

    try {
        // Extract medicine name (usually first few lines before "Tablets" or "Capsules")
        const nameMatch = text.match(/^([^\n]+(?:Tablets|Capsules)[^\n]*)/i);
        if (nameMatch) {
            details.medicineName = nameMatch[1].trim();
        }

        // Extract expiry date
        const expiryMatch = text.match(/EXP\.?\s*(?:DATE)?[:.]?\s*([A-Za-z]+[-\s]+\d{4}|\d{2}[-/]\d{4}|\d{2}[-/]\d{2}[-/]\d{2,4})/i);
        if (expiryMatch) {
            details.expiryDate = expiryMatch[1].trim();
        }

        // Extract ingredients (usually after "contains" or "composition")
        const ingredientsMatch = text.match(/(?:contains|composition|ingredients)[:.]?\s*([^.]*\.)/i);
        if (ingredientsMatch) {
            details.ingredients = ingredientsMatch[1].trim();
        }

        // Try to find quantity (usually a number followed by tablets/capsules)
        const quantityMatch = text.match(/(\d+)\s*(?:tablets?|capsules?|TAB)/i);
        if (quantityMatch) {
            details.quantity = parseInt(quantityMatch[1]);
        }

        return details;
    } catch (error) {
        console.error('Error in regex extraction:', error);
        return details;
    }
}

/**
 * Extracts medicine details from OCR text using Gemini API with fallback
 * @param {string} text - Raw OCR text
 * @returns {Promise<Object>} - Extracted medicine details
 */
async function extractMedicineDetails(text) {
    try {
        // First try Gemini API
        const response = await fetch('http://localhost:8000/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text }),
            // Add timeout to prevent long waiting
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('Gemini API unavailable, falling back to regex extraction:', error);
        // Fall back to regex-based extraction
        return extractDetailsFromText(text);
    }
}

/**
 * Creates FormData object for API request
 * @param {File|string} imageData - Image file or URL
 * @param {boolean} isUrl - Whether the input is a URL
 * @returns {FormData} - FormData object
 */
function createFormData(imageData, isUrl) {
    const formData = new FormData();
    formData.append('apikey', API_CONFIG.apiKey);
    
    // Add all options
    for (const [key, value] of Object.entries(API_CONFIG.options)) {
        formData.append(key, value);
    }
    
    if (isUrl) {
        // For URLs, we need to use the URL parameter
        formData.append('url', imageData);
        formData.append('filetype', 'URL'); // Specify that we're using a URL
        console.log('Using URL mode for OCR');
    } else {
        formData.append('file', imageData);
        formData.append('filetype', 'JPG'); // Default to JPG for file uploads
        console.log('Using file upload mode for OCR');
    }
    
    return formData;
}

/**
 * Makes API request with rate limiting
 * @param {FormData} formData - Request form data
 * @returns {Promise<Object>} - API response
 */
async function makeRequest(formData) {
    // Check rate limit
    const now = Date.now();
    if (now - lastRequestTime < 60000) { // Within 1 minute
        requestCount++;
        if (requestCount > RATE_LIMIT.maxRequestsPerMinute) {
            throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        }
    } else {
        requestCount = 1;
        lastRequestTime = now;
    }
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_CONFIG.endpoint, true);
        
        // Set timeout
        xhr.timeout = 30000; // 30 seconds timeout
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    validateResponse(data);
                    resolve(data);
                } catch (e) {
                    console.error('Error parsing OCR response:', e);
                    reject(new Error('Error parsing OCR response: ' + e.message));
                }
            } else {
                reject(new Error(`OCR API Error: ${xhr.status} ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network Error: Could not connect to OCR API'));
        };
        
        xhr.ontimeout = function() {
            reject(new Error('Request timed out. Please try again.'));
        };
        
        xhr.send(formData);
    });
}

/**
 * Validates OCR API response
 * @param {Object} data - API response data
 * @throws {Error} If response is invalid
 */
function validateResponse(data) {
    console.log('Validating OCR response:', data);
    
    if (!data) {
        console.error('Empty response from OCR API');
        throw new Error('Empty response from OCR API');
    }

    if (data.IsErroredOnProcessing) {
        console.error('OCR Processing Error:', data.ErrorMessage);
        throw new Error(data.ErrorMessage || 'OCR processing failed');
    }

    if (!data.ParsedResults || !Array.isArray(data.ParsedResults)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from OCR API');
    }

    if (data.ParsedResults.length === 0) {
        console.error('No text found in image. Response:', data);
        throw new Error('No text found in the image. Please ensure the image is clear and contains text.');
    }

    const firstResult = data.ParsedResults[0];
    if (!firstResult || !firstResult.ParsedText) {
        console.error('No text content in result:', firstResult);
        throw new Error('No text content in OCR result. Please try again with a clearer image.');
    }
    
    console.log('OCR text content:', firstResult.ParsedText);
}

/**
 * Handles rate limit by implementing retry logic
 * @param {FormData} formData - Request form data
 * @returns {Promise<Object>} - API response
 */
async function handleRateLimit(formData) {
    let retries = 0;
    while (retries < RATE_LIMIT.maxRetries) {
        try {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.retryDelay));
            return await makeRequest(formData);
        } catch (error) {
            retries++;
            if (retries === RATE_LIMIT.maxRetries) {
                throw new Error('Max retries exceeded. Please try again later.');
            }
        }
    }
}

/**
 * Tests OCR API connection
 * @returns {Promise<Object>} - Test response
 */
export async function testConnection() {
    const formData = new FormData();
    formData.append('apikey', API_CONFIG.apiKey);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '2');
    formData.append('url', 'https://i.imgur.com/fwT8k1E.png');
    
    return makeRequest(formData);
}

/**
 * Tests connection to all required services
 * @returns {Promise<Object>} - Test results
 */
export async function testAllConnections() {
    const results = {
        ocrSpace: false,
        supabase: false,
        gemini: false,
        message: ''
    };

    try {
        // Test OCR.space connection
        console.log('Testing OCR.space connection...');
        const ocrTest = await testConnection();
        results.ocrSpace = true;
        console.log('OCR.space test successful');

        // Test Supabase connection
        console.log('Testing Supabase connection...');
        const supabaseTest = await fetch(`${SUPABASE_URL}/rest/v1/donated_meds?limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY
            }
        });
        results.supabase = supabaseTest.ok;
        console.log('Supabase test successful');

        // Test Gemini API connection
        console.log('Testing Gemini API connection...');
        const geminiTest = await fetch('http://localhost:8000/test-gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: 'Test connection'
            })
        });
        results.gemini = geminiTest.ok;
        console.log('Gemini API test successful');

        // Set overall status message
        if (results.ocrSpace && results.supabase && results.gemini) {
            results.message = 'All connections successful!';
        } else {
            const failed = [];
            if (!results.ocrSpace) failed.push('OCR.space');
            if (!results.supabase) failed.push('Supabase');
            if (!results.gemini) failed.push('Gemini API');
            results.message = `Connection failed for: ${failed.join(', ')}`;
        }

        return results;
    } catch (error) {
        console.error('Connection test error:', error);
        results.message = `Connection test failed: ${error.message}`;
        return results;
    }
}