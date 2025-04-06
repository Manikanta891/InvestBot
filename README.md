# 💸 InvestBot – GenAI-Powered Financial Assistant for Better Investing Decisions

**InvestBot** is a next-generation AI-powered financial assistant designed to help users—especially beginner investors in India—make smarter investment decisions. The app bridges the gap between **financial literacy** and **investment accessibility** using a powerful GenAI-driven conversational interface and real-time data-driven tools.

India is witnessing a surge in retail investors, but financial literacy remains low. InvestBot empowers users by enabling natural language conversations, personalized insights, virtual portfolio tracking, and educational content—at scale—powered by AI.

---

## 🎯 Objective

For the hundreds of millions of investors entering the Indian market, manual financial guidance is not scalable. **AI is the only solution** to democratize investment insights, enhance financial education, and provide 24/7 personalized assistance. InvestBot leverages **Google’s GenAI technologies** to:

- Guide users through their financial journeys  
- Offer personalized recommendations  
- Simplify complex investment concepts  
- Deliver real-time, actionable insights

---

## 📲 App Features & User Flow

### 1. 🎓 Learning Stream  
- ` Select Educational Videos `

- `Watch in-app `

- `Ask Chatbot for Clarification`

### 2. 🌐 Real-World Scenario Practice  
- `Select Scenario `
  
- `Practice Market-based Situations`

### 3. 💼 Virtual Portfolio  
- ` Fetch Live Market Data (Yahoo Finance API) `

- `Simulate Investments `

-  `Manage Portfolio`

### 4. 📰 News Summaries  
- ` Fetch Latest Financial News `
- `Summarize with GenAI` 
- `Perform Sentiment Analysis`

### 5. 📊 Financial Tools & Insights  
- ` User Enters Query `
- ` Generate Visualization (PowerBI/Tableau-style) `
- `Display Company Insights`

### 6. 🔗 Portfolio Integration  
- ` Connect to Platforms like Zerodha/Fyers `

- `Chatbot Gives Portfolio Insights`

### 7. 💹 Financial Health Score  
- ` Track Financial Progress `  

- `GenAI Suggests Personalized Improvements`

### 8. 🤖 Conversational Financial Chatbot  
- ` Users Ask Questions (Natural Language) `

- `GenAI Provides Actionable Responses`

---

## 🧠 Tech Stack Overview

| Layer         | Technologies Used                                                                 |
|---------------|-------------------------------------------------------------------------------------|
| **Frontend**  | React Native (Expo)                                                                |
| **AI/GenAI**  | Gemini 2.0, Google Vertex AI, Google AI Studio, Gemini Code Assist                 |
| **Backend**   | Node.js, Express.js, Dialogflow (Google Dialog Framework), Webhook Integration     |
| **Database**  | MongoDB                                                                             |
| **APIs**      | Yahoo Finance API (via `finance-2`), Fyers API, Email API, YouTube Data API v3     |
| **Cloud**     | Google Cloud Platform (GCP)                                                         |

---

## 🏗️ System Architecture

```plaintext
        ┌────────────────────────┐
        │     Mobile Frontend    │
        │    (React Native App)  │
        └──────────┬─────────────┘
                   │
           8 Feature Modules
                   │
         ┌─────────▼─────────┐
         │     Backend API   │  ← Node.js + Express.js
         └─────────┬─────────┘
                   │
        ┌──────────▼──────────┐
        │    Dialogflow AI    │  ← Google Dialog Framework
        └──────────┬──────────┘
                   │
         ┌─────────▼─────────┐
         │     Gemini 2.0    │  ← Vertex AI + AI Studio
         └─────────┬─────────┘
                   │
        ┌──────────▼──────────┐
        │     External APIs   │
        │ Yahoo Finance, Fyers│
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │      MongoDB        │
        └─────────────────────┘

```
---
## 🚀 How to Run the App

  📱 React Native App (Frontend)

  Use Expo Go app or Android/iOS emulator to run the app.

      cd mobile-app
      npm install
      npx expo start

   🌐 Backend Server (Node.js + Express)

  Ensure environment variables for APIs and Dialogflow webhook endpoints are configured.

      cd backend
      npm install
      node index.js








