
import React, { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSpeechServices } from "@/hooks/useSpeechServices";
import { LANGUAGES, detectLanguage } from "@/utils/languageDetection";
import { generateStructuredResponse, getWelcomeMessage } from "@/utils/responseGenerator";
import ChatContainer from "./chatbot/ChatContainer";
import { ChatMessage } from "@/types/chatbot";

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  const [languageCode, setLanguageCode] = useState<string>("en-US");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const lastDetectedLanguage = useRef<string>("English");
  const isMobile = useIsMobile();

  const { 
    isListening, 
    isSpeaking, 
    toggleListening, 
    speakText, 
    stopSpeaking 
  } = useSpeechServices({
    languageCode,
    currentLanguage,
    voiceEnabled
  });

  // Initialize welcome message based on language
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([
        { role: "assistant", content: getWelcomeMessage(currentLanguage) }
      ]);
    }
  }, [currentLanguage, languageCode]);

  // Stop speaking if voice is disabled
  useEffect(() => {
    if (!voiceEnabled && isSpeaking) {
      stopSpeaking();
    }
  }, [voiceEnabled, isSpeaking, stopSpeaking]);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    setLanguageCode(LANGUAGES[language as keyof typeof LANGUAGES]);
    setShowLanguageMenu(false);
  };

  const handleToggleListening = () => {
    toggleListening((transcript) => {
      setInput(transcript);
      // Submit transcript automatically
      handleSend(transcript);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    // Detect language from user input
    const detectedLanguage = detectLanguage(text);
    
    // Update current language if detection is confident
    if (detectedLanguage !== currentLanguage) {
      changeLanguage(detectedLanguage);
      lastDetectedLanguage.current = detectedLanguage;
    }
    
    // Add user message
    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // Generate response based on the query and detected language
    setTimeout(() => {
      const responseContent = generateStructuredResponse(text, detectedLanguage);
      
      const aiResponse = { 
        role: "assistant" as const, 
        content: responseContent
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      // Convert AI response to speech if voice is enabled
      if (voiceEnabled) {
        speakText(aiResponse.content);
      }
    }, 1000);
  };

  const toggleVoice = () => {
    // If turning voice off, make sure to stop any ongoing speech
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      { role: "assistant", content: getWelcomeMessage(currentLanguage) }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isMobile={isMobile}
      messages={messages}
      input={input}
      isListening={isListening}
      isSpeaking={isSpeaking}
      voiceEnabled={voiceEnabled}
      currentLanguage={currentLanguage}
      showLanguageMenu={showLanguageMenu}
      onInputChange={handleInputChange}
      onSend={() => handleSend()}
      onToggleListening={handleToggleListening}
      onToggleVoice={toggleVoice}
      onClearChat={clearChat}
      onLanguageSelect={changeLanguage}
      onToggleLanguageMenu={() => setShowLanguageMenu(!showLanguageMenu)}
      onKeyPress={handleKeyPress}
      supportedLanguages={LANGUAGES}
    />
  );
};

export default Chatbot;
