

# 🏥 MediShare: Smart Medicine Redistribution Platform

MediShare is an **AI & OCR-powered** platform that **reduces medical waste** and **improves healthcare access** by enabling the **smart redistribution** of unused, sealed medicines.  

## 🌍 Project Overview  
MediShare creates a **three-level donation ecosystem**:  

|  Donors (Hospitals & Pharmacies) |  NGOs |  Recipients (Clinics & Communities) |
|-------------------------------------|--------|--------------------------------------|
| Upload surplus medicines. | Verify, collect, and manage donations. | Receive medicines based on real-time needs. |

By combining **AI, OCR, and smart logistics**, MediShare ensures **verified, efficient, and timely** medicine delivery—**turning waste into life-saving support**.  

---

## 👥 Meet Our Team  
**Track:** Open Innovation  

| Name          | Year | College |
|--------------|------|---------|
| Sameeksha   | 3rd  | DTU     |
| Soumya Garg | 2nd  | DTU     |
| Deepanshi   | 3rd  | DTU     |
| Tasneem Ahmed | 3rd | DTU |

---

## 🚀 Key Features  

| Feature  | Description |
|----------|------------|
| 📄 **OCR-Based Medicine Verification** | Extracts **medicine names, expiry dates, and active ingredients** from images using **OCR Space** & **Google AI Studio API**. |
| 🧠 **AI-Based Medicine Matching** | Ensures **therapeutically equivalent** medicine matches based on composition and active ingredients. |
| 📍 **Location-Based Filtering with Maps** | Uses **Leaflet.js** to filter medicines based on **proximity and logistics optimization**. |
| 💬 **Multilingual Chatbot Support** | Provides **voice & text-based assistance** in **multiple Indian languages**. |

---

## 🚀 LOGIN DETAILS FOR WEBSITE  

| Role  | Login | Password | 
|----------|------------|----------|
| Admin | admin1@gmail.com | 1234 |
| Donor | donor1@gmail.com | 1234 |
| NGO | ngo1@gmail.com | 1234 |
| Recipient | recipient1@gmail.com | 1234 |

---


## 🎯 Problems Solved  

✅ **Medical Waste** – Reduces **₹15,000–₹18,000 crore** worth of medicines wasted annually.  
✅ **Lack of Access** – Provides low-income communities with **affordable medicine options**.  
✅ **Environmental Pollution** – Lowers **pharmaceutical waste** polluting **soil & water**.  
✅ **Inefficient Donation Systems** – Replaces **manual, unverified donations** with **AI, OCR & smart logistics**.  

---
## 🔗Dependencies

1. **Frontend**: 
React.js, Typescript, Vite,
Tailwind CSS,
Leaflet(For map integration),
Recharts(for anayltics implementation)


2. **Backend**:
Python 3.9+,
PostgreSQL (via Supabase),
OCR.space API, 
Google studio GEMINI(1.5 Pro) API key.


3. **Deployment**:
Vercel

3. **Microservices**:
FAST API,
FLASK API
---
📺 **Demo Video**: https://youtu.be/ybJOB2mnxnA

📺 **Deployed Website**: https://medishare-codeforge-hackathon.vercel.app/

📺 **Project PPT**: https://drive.google.com/file/d/1lUZlGHH2q16Q0lDHgLI5_Pz3NlVYDahl/view


---

## 🛠️Setup Instructions 
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

## 📌 Usage  

#### **🔹 For Donors**  
✔ Click **"Add Donations"** to donate medicines.           
✔ The platform extracts medicine details automatically (name, expiry date, ingredients) using **OCR & Gemini AI** .                    
✔ All donations are **subject to Admin approval** before being available for NGOs to claim.  

#### **🔹 For NGOs**  
✔ Browse **"Available Medicines"** to find donations.  
✔ View and approve recipient requests under **"Requested Medicines"**.  
✔ Use the **Maps feature** to find nearby **Donors** and optimize donation logistics.  
✔ Access **Impact Analytics** for donation insights.  

#### **🔹 For Recipients**  
✔ Log in and navigate to the **Recipient Dashboard**.  
✔ Submit medicine requests which will be furthur approved by the admin.  

#### **🔹 For Admins**  
✔ Verify new users (only verified users can log in).  
✔ Approve/reject:  
   - *Donations* submitted by donors.  
   - *Requests* made by recipients to prevent misuse.  

---

## License
This project is licensed under the MIT License.

## 💡Contribution Guidelines
1.Fork the repository and create a new branch for your contributions.

2.Submit a pull request with a clear description of your changes.

3.Follow coding best practices and maintain proper documentation.

## 🚀Future Plans
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



