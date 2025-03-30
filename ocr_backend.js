import { processImage, testConnection, testAllConnections } from './ocrProcessor.js';
import { filterOCRText } from './gemini_extractor.js';

document.addEventListener("DOMContentLoaded", function () {
    const extractButton = document.getElementById("extractText");
    const fileInput = document.getElementById("imageUpload");
    const urlInput = document.getElementById("imageUrl");
    const medicineIdInput = document.getElementById("medicineId");
    const extractedText = document.getElementById("extractedText");
    const medicineDetails = document.getElementById("medicineDetails");
    const testConnectionButton = document.getElementById("testConnection");

    // Add loading indicator
    function showLoading(step) {
        if (extractButton) {
            extractButton.disabled = true;
            extractButton.textContent = `Processing... ${step}`;
        }
        if (extractedText) {
            extractedText.innerText = `Processing image... ${step}`;
        }
        if (medicineDetails) {
            medicineDetails.innerHTML = `Extracting details... ${step}`;
        }
    }

    function hideLoading() {
        if (extractButton) {
            extractButton.disabled = false;
            extractButton.textContent = "Extract Text";
        }
    }

    // Add connection test button event listener
    testConnectionButton.addEventListener("click", async function() {
        showLoading("Testing connections...");
        try {
            const results = await testAllConnections();
            
            // Create status display
            const statusDiv = document.createElement("div");
            statusDiv.className = "connection-status";
            
            // Add status indicators
            const statusHtml = `
                <h3>Connection Status:</h3>
                <ul>
                    <li class="${results.ocrSpace ? 'success' : 'error'}">
                        OCR.space: ${results.ocrSpace ? 'Connected' : 'Failed'}
                    </li>
                    <li class="${results.supabase ? 'success' : 'error'}">
                        Supabase: ${results.supabase ? 'Connected' : 'Failed'}
                    </li>
                    <li class="${results.gemini ? 'success' : 'error'}">
                        Gemini API: ${results.gemini ? 'Connected' : 'Failed'}
                    </li>
                </ul>
                <p class="status-message">${results.message}</p>
            `;
            
            statusDiv.innerHTML = statusHtml;
            
            // Display results
            if (extractedText) {
                extractedText.innerHTML = statusHtml;
            }
            
            // Add to medicine details if available
            if (medicineDetails) {
                const existingStatus = medicineDetails.querySelector(".connection-status");
                if (existingStatus) {
                    existingStatus.remove();
                }
                medicineDetails.appendChild(statusDiv);
            }
            
        } catch (error) {
            console.error("Connection test error:", error);
            showError("Connection test failed: " + error.message);
        } finally {
            hideLoading();
        }
    });

    extractButton.addEventListener("click", async function () {
        const file = fileInput.files[0];
        const imageUrl = urlInput.value.trim();
        const medicineId = parseInt(medicineIdInput.value);

        if (!medicineId) {
            showError("Please enter a valid Medicine ID.");
            return;
        }

        if (!file && !imageUrl) {
            showError("Please upload an image or enter an image URL.");
            return;
        }

        showLoading("Step 1/3: Starting OCR...");

        try {
            // First, get the OCR text from OCR.space
            const ocrResult = await processImage(file || imageUrl, medicineId);
            const rawText = ocrResult.ParsedResults[0].ParsedText;
            
            showLoading("Step 2/3: Processing text...");
            
            // Then, filter the text using Gemini API
            const filteredResult = await filterOCRText(rawText);
            
            showLoading("Step 3/3: Updating display...");
            
            // Display the results
            processOcrResponse(filteredResult);
        } catch (error) {
            handleOcrError(error);
        } finally {
            hideLoading();
        }
    });

    // Add debugging button event listener
    document.getElementById("testOcr").addEventListener("click", async function() {
        const extractedText = document.getElementById("extractedText");
        extractedText.innerText = "Testing OCR API connection using a test image...";
        
        try {
            const data = await testConnection();
            extractedText.innerText = "OCR API Connection Successful!\n\nResponse: " + JSON.stringify(data, null, 2);
        } catch (error) {
            console.error("OCR Test Error:", error);
            extractedText.innerText = "OCR API Test Failed: " + error.message;
        }
    });

    /**
     * Processes OCR response and displays results
     * @param {Object} data - Filtered medicine details
     */
    function processOcrResponse(data) {
        console.log("Full API Response:", data);
        
        // Display raw text
        const extractedText = document.getElementById("extractedText");
        if (extractedText) {
            // Format the text for better readability
            const formattedText = data.rawText
                .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
                .replace(/([.!?])\s+/g, '$1\n')  // Add newlines after sentence endings
                .trim();
            extractedText.innerText = formattedText;
            console.log("Updated extracted text element");
        } else {
            console.error("extractedText element not found");
        }
        
        // Update form fields inside medicineDetails container
        const medicineDetails = document.getElementById("medicineDetails");
        if (medicineDetails) {
            // Update medicine name
            const medicineNameInput = medicineDetails.querySelector("#medicineName");
            if (medicineNameInput) {
                medicineNameInput.value = data.medicineName || '';
                console.log("Updated medicine name:", data.medicineName);
            }
            
            // Update manufacturing date
            const mfgDateInput = medicineDetails.querySelector("#manufacturingDate");
            if (mfgDateInput) {
                mfgDateInput.value = data.manufacturingDate || '';
                console.log("Updated manufacturing date:", data.manufacturingDate);
            }
            
            // Update expiry date
            const expDateInput = medicineDetails.querySelector("#expiryDate");
            if (expDateInput) {
                expDateInput.value = data.expiryDate || '';
                console.log("Updated expiry date:", data.expiryDate);
            }
            
            // Update ingredients
            const ingredientsInput = medicineDetails.querySelector("#ingredients");
            if (ingredientsInput) {
                ingredientsInput.value = data.ingredients || '';
                console.log("Updated ingredients:", data.ingredients);
            }
            
            // Update raw text
            const rawTextInput = medicineDetails.querySelector("#rawText");
            if (rawTextInput) {
                rawTextInput.value = data.rawText || '';
                console.log("Updated raw text");
            }
        } else {
            console.error("medicineDetails container not found");
        }
    }
    
    /**
     * Handles OCR errors and displays user-friendly messages
     * @param {Error} error - Error object
     */
    function handleOcrError(error) {
        console.error("Error:", error);
        showError(error.message);
    }
    
    /**
     * Shows error message to user
     * @param {string} message - Error message
     */
    function showError(message) {
        const errorDiv = document.createElement("div");
        errorDiv.className = "error-message";
        errorDiv.textContent = message;
        
        const container = document.querySelector(".container");
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}); 