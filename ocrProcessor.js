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

// Rate limiting configuration
const RATE_LIMIT = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    maxRequestsPerMinute: 30
};

let requestCount = 0;
let lastRequestTime = Date.now();

/**
 * Processes an image through OCR API with retry logic
 * @param {File} imageFile - Image file to process
 * @returns {Promise<Object>} - OCR API response
 */
export async function processImage(imageFile) {
    if (!imageFile) {
        throw new Error('No image file provided');
    }

    if (!imageFile.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image file.');
    }

    const formData = createFormData(imageFile);
    
    try {
        const ocrResult = await makeRequest(formData);
        return ocrResult;
    } catch (error) {
        if (error.message.includes('rate limit')) {
            return await handleRateLimit(formData);
        }
        throw error;
    }
}

/**
 * Creates FormData object for API request
 * @param {File} imageFile - Image file
 * @returns {FormData} - FormData object
 */
function createFormData(imageFile) {
    const formData = new FormData();
    formData.append('apikey', API_CONFIG.apiKey);
    
    // Add all options
    for (const [key, value] of Object.entries(API_CONFIG.options)) {
        formData.append(key, value);
    }
    
    formData.append('file', imageFile);
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
        
        xhr.onload = function() {
            console.log('OCR API Response Status:', xhr.status);
            console.log('OCR API Response Headers:', xhr.getAllResponseHeaders());
            
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    console.log('Raw OCR API Response:', data);
                    validateResponse(data);
                    resolve(data);
                } catch (e) {
                    console.error('Error parsing OCR response:', e);
                    reject(new Error('Error parsing OCR response: ' + e.message));
                }
            } else {
                console.error('OCR API Error Response:', xhr.responseText);
                reject(new Error(`OCR API Error: ${xhr.status} ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            console.error('Network Error:', xhr.status);
            reject(new Error('Network Error: Could not connect to OCR API. Please check your internet connection.'));
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