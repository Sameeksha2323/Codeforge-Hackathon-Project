# Medicine Label OCR

A web application that extracts structured information from medicine labels using OCR and AI.

## Features

- Upload medicine label images
- Extract text using OCR.space API
- Process and structure text using Google Gemini API
- Display extracted medicine details in a user-friendly format
- Real-time error handling and feedback

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OCR.space API
- Google Gemini API

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd medicine-ocr
```

2. Replace the API keys in the code:
   - In `ocrProcessor.js`: Replace `K83805636688957` with your OCR.space API key
   - In `gemini_extractor.js`: Replace `AIzaSyA4ANGZ6cHuipZSxMfcFlwfyj2OAmVgGJ0` with your Gemini API key

3. Open `index.html` in a web browser

## Usage

1. Click "Choose File" to upload a medicine label image
2. Click "Extract Text" to process the image
3. View the extracted information in the form fields and formatted display

## Extracted Information

The application extracts the following details from medicine labels:
- Medicine Name
- Batch Number
- Manufacturing Date
- Expiry Date
- Ingredients

## API Integration

### OCR.space API
- Used for initial text extraction from images
- Handles various image formats
- Includes rate limiting and error handling

### Google Gemini API
- Processes extracted text to identify medicine details
- Structures the information into a consistent format
- Handles various text formats and OCR errors

## Error Handling

The application includes comprehensive error handling for:
- Invalid file types
- API rate limits
- Network errors
- OCR processing errors
- Text parsing errors

## Browser Support

The application works on modern browsers that support:
- ES6+ JavaScript
- Fetch API
- File API
- FormData API

## Security Notes

- API keys are currently hardcoded in the frontend code
- For production use, consider moving API calls to a backend server
- Implement proper API key management and security measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 