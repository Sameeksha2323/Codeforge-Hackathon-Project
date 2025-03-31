
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getLocalizedText } from "@/utils/responseGenerator";

interface UseSpeechServicesProps {
  languageCode: string;
  currentLanguage: string;
  voiceEnabled: boolean;
}

export const useSpeechServices = ({ 
  languageCode, 
  currentLanguage, 
  voiceEnabled 
}: UseSpeechServicesProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    initializeSpeechRecognition();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [languageCode]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // This is specifically to stop speaking when voiceEnabled is toggled off
  useEffect(() => {
    if (!voiceEnabled && isSpeaking) {
      stopSpeaking();
    }
  }, [voiceEnabled]);

  const initializeSpeechRecognition = () => {
    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    
    // Feature detection for Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = languageCode;
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast({
          title: getLocalizedText("Voice recognition error", currentLanguage),
          description: getLocalizedText("Failed to recognize your voice. Please try again or use text input.", currentLanguage),
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      toast({
        title: getLocalizedText("Voice feature unavailable", currentLanguage),
        description: getLocalizedText("Your browser doesn't support voice recognition. Please use text input instead.", currentLanguage),
        variant: "destructive",
      });
    }
  };

  const toggleListening = (onResultCallback: (transcript: string) => void) => {
    if (!recognitionRef.current) {
      toast({
        title: getLocalizedText("Voice feature unavailable", currentLanguage),
        description: getLocalizedText("Your browser doesn't support voice recognition.", currentLanguage),
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        // Set up the onresult handler with the provided callback
        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          onResultCallback(transcript);
        };
        
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        toast({
          title: getLocalizedText("Voice recognition error", currentLanguage),
          description: getLocalizedText("Failed to start voice recognition. Please try again.", currentLanguage),
          variant: "destructive",
        });
      }
    }
  };

  const speakText = (text: string) => {
    // If voice is disabled, don't speak
    if (!voiceEnabled) return;
    
    // Remove markdown formatting for speech
    const cleanText = text.replace(/#{1,6} /g, '').replace(/\*\*/g, '').replace(/\n/g, '. ');
    
    // Use browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      stopSpeaking();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = languageCode;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: getLocalizedText("Speech synthesis error", currentLanguage),
          description: getLocalizedText("Failed to convert text to speech.", currentLanguage),
          variant: "destructive",
        });
      };
      
      // Store the utterance to be able to cancel it
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: getLocalizedText("Text-to-speech unavailable", currentLanguage),
        description: getLocalizedText("Your browser doesn't support text-to-speech.", currentLanguage),
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      speechSynthesisRef.current = null;
      setIsSpeaking(false);
    }
  };

  return {
    isListening,
    isSpeaking,
    toggleListening,
    speakText,
    stopSpeaking
  };
};
