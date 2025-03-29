import { processImage, testConnection } from './ocrProcessor.js';
import { filterOCRText } from './gemini_extractor.js';

document.addEventListener("DOMContentLoaded", function () {
    const extractButton = document.getElementById("extractText");
    const fileInput = document.getElementById("imageUpload");
    const extractedText = document.getElementById("extractedText");
    const medicineDetails = document.getElementById("medicineDetails");

    // Add loading indicator
    function showLoading() {
        if (extractButton) {
            extractButton.disabled = true;
            extractButton.textContent = "Processing...";
        }
        if (extractedText) {
            extractedText.innerText = "Processing image... Please wait.";
        }
        if (medicineDetails) {
            medicineDetails.innerHTML = "Extracting details...";
        }
    }

    function hideLoading() {
        if (extractButton) {
            extractButton.disabled = false;
            extractButton.textContent = "Extract Text";
        }
    }

    extractButton.addEventListener("click", async function () {
        if (!fileInput.files.length) {
            showError("Please upload an image first.");
            return;
        }

        const imageFile = fileInput.files[0];
        showLoading();

        try {
            console.log("Starting OCR request...");
            // First, get the OCR text from OCR.space
            const ocrResult = await processImage(imageFile);
            const rawText = ocrResult.ParsedResults[0].ParsedText;
            
            // Then, filter the text using Gemini API
            console.log("Filtering text with Gemini API...");
            const filteredResult = await filterOCRText(rawText);
            
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
            
            // Update batch number
            const batchNumberInput = medicineDetails.querySelector("#batchNumber");
            if (batchNumberInput) {
                batchNumberInput.value = data.batchNumber || '';
                console.log("Updated batch number:", data.batchNumber);
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
        
        // Also display medicine details in a formatted way
        const detailsContainer = document.createElement("div");
        detailsContainer.className = "medicine-details";
        
        const details = [
            { label: "Medicine Name", value: data.medicineName },
            { label: "Batch Number", value: data.batchNumber },
            { label: "Manufacturing Date", value: data.manufacturingDate },
            { label: "Expiry Date", value: data.expiryDate },
            { label: "Ingredients", value: data.ingredients }
        ];
        
        details.forEach(detail => {
            const detailDiv = document.createElement("div");
            detailDiv.className = "detail-item";
            detailDiv.innerHTML = `<strong>${detail.label}:</strong> ${detail.value || 'Not detected'}`;
            detailsContainer.appendChild(detailDiv);
        });
        
        // Add the details container to the medicineDetails section
        if (medicineDetails) {
            // Remove any existing details container
            const existingDetails = medicineDetails.querySelector(".medicine-details");
            if (existingDetails) {
                existingDetails.remove();
            }
            medicineDetails.appendChild(detailsContainer);
        }
    }
    
    /**
     * Displays medicine details in a container
     * @param {Object} data - Medicine details object 
     * @param {HTMLElement} container - Container element
     */
    function displayMedicineDetails(data, container) {
        if (!container) return;
        
        container.innerHTML = "";
        
        // Create heading
        const heading = document.createElement("h2");
        heading.textContent = "Medicine Details";
        container.appendChild(heading);
        
        // Create details sections
        const createSection = (title, content) => {
            const section = document.createElement("div");
            section.className = "detail-section";
            
            const titleElem = document.createElement("h3");
            titleElem.textContent = title;
            section.appendChild(titleElem);
            
            const contentElem = document.createElement("div");
            contentElem.textContent = content || "Not detected";
            section.appendChild(contentElem);
            
            return section;
        };
        
        // Add sections (always show all sections)
        const sections = [
            createSection("Medicine Name", data.medicineName),
            createSection("Batch Number", data.batchNumber),
            createSection("Manufacturing Date", data.manufacturingDate),
            createSection("Expiry Date", data.expiryDate),
            createSection("Ingredients", data.ingredients)
        ];
        
        // Add all sections to container
        sections.forEach(section => {
            container.appendChild(section);
        });
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