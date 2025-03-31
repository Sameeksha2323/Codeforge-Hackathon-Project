

#  MediShare: Smart Medicine Redistribution Platform

##  Project Overview
MediiShare is an AI-powered platform designed to reduce medical waste and improve healthcare access by enabling the smart redistribution of unused, sealed medicines. It establishes a streamlined, three-level ecosystem:

*Donors (Hospitals & Pharmacies) upload surplus medicines.

*NGOs verify, collect, and manage the donations.

*Recipients (low-income clinics or communities) receive the medicines based on real-time needs.

By combining AI, OCR, and smart logistics, MediiShare ensures efficient, verified, and timely delivery of medicines—transforming waste into life-saving support.

##  Meet Our Team
Track: Open Innovation

| Name | Year | College |
|------|------|--------|
| Sameeksha | 3rd | DTU |
| Soumya Garg | 2nd | DTU |
| Deepanshi | 3rd | DTU |
| Tasneem Ahmed | 3rd | DTU |

## Key Features 
*🔍 OCR-Based Medicine Verification
Extracts medicine names, expiry dates, and active ingredients from uploaded images.
Uses tools like OCR Space, Google Vision API, and AWS Textract for accurate data capture.

*🧠  AI-Based Matching of Medicines
Analyzes similarity in composition and ingredient match between donated and required medicines.
Ensures recipients receive therapeutically equivalent drugs, not just exact matches.

*📍Location-Based Filtering with Maps
Leaflet.js is used for seamless map integration and location filtering.
Helps NGOs prioritize local matches and optimize logistics based on proximity.

*💬Multilingual Chatbot Support
Provides voice and text-based assistance to all stakeholders in multiple Indian languages.
Ensures inclusivity for NGOs, hospitals, and rural recipients.


## Problems Solved
*Medical Waste: Tackles the ₹15,000–₹18,000 crore worth of unused medicines wasted annually in India.

*Lack of Access: Bridges the gap for low-income communities that lack basic medicines.

*Environmental Pollution: Reduces pharmaceutical waste that pollutes soil and water.

*Inefficient Donation Systems: Replaces manual, unverified donation processes with AI, OCR, and smart logistics.

## Dependencies

1. Frontend: 
Node.js (Latest LTS),
React.js, Next.js, Vite,
Tailwind CSS,
Supabase SDK,
Leaflet(For map integration),
Recharts(for anayltics implementation)


3. Backend:
Python 3.9+,
PostgreSQL (via Supabase),
OCR.space API, 
Google studio GEMINI(1.5 Pro) API key,


## Setup Instructions 
1. Clone the repository :
   Git Clone https://github.com/Sameeksha2323/Codeforge-Hackathon-Project
   cd medishare
   
2. Install Dependecies
   Frontend : npm install/i
   Backend : pip install -r requirements.txt
   
3. Set Up Environment Variables
   Create a .env file in the root directory and add the following:
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   OCR_API_KEY=your_ocr_space_api_key
   GOOGLE_VISION_KEY=your_google_vision_api_key

4. Replace the API keys in the code:
   - In `ocrProcessor.js`: Replace the given OCR.space API key with your OCR.space API key
   - In `gemini_extractor.js`: Replace the given Gemini API key with your Google Studio Gemini API key
   
5. Run the Application
   Frontend: npm run dev  (Starts the React/Next.js frontend)
   Backend: python backend/app.py (starts the backend server) 

## Usage

1. Click "Choose File" to upload a medicine label image
2. Click "Extract Text" to process the image
4. View the extracted information in the form fields and formatted display.


## License
This project is licensed under the MIT License.

## Contribution Guidelines
1.Fork the repository and create a new branch for your contributions.

2.Submit a pull request with a clear description of your changes.

3.Follow coding best practices and maintain proper documentation.

## Future Plans
*📱 Mobile App for Households
Develop a user-friendly mobile app that allows individuals and families to donate unused, sealed medicines—extending the redistribution network beyond hospitals and pharmacies.

*🏥 Integration with Government & Public Health Systems
Collaborate with national healthcare programs, public hospitals, and state-run clinics to scale operations, align with CSR initiatives, and support medicine access at a policy level.

*🚚 Logistics & Cold Chain Partnerships
Partner with logistics providers and pharmaceutical supply chains to ensure secure, temperature-controlled, and efficient delivery of sensitive medicines.

*🔗 Blockchain for Transparency & Compliance
Implement blockchain-based tracking to ensure transparency, authenticity, and legal compliance throughout the donation lifecycle—building trust among donors, NGOs, and recipients.

*📊 Analytics Dashboard for Stakeholders
Introduce an advanced dashboard offering real-time analytics for NGOs, donors, and healthcare authorities to track impact, inventory, and optimize supply-demand chains.



