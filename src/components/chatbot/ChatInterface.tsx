
import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, X, Volume2, VolumeX, Globe } from "lucide-react";
import { getLocalizedText } from "@/utils/responseGenerator";
import { ChatMessage } from "@/types/chatbot";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
  currentLanguage: string;
  showLanguageMenu: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onToggleListening: () => void;
  onToggleVoice: () => void;
  onClearChat: () => void;
  onLanguageSelect: (lang: string) => void;
  onToggleLanguageMenu: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  supportedLanguages: Record<string, string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  input,
  isListening,
  isSpeaking,
  voiceEnabled,
  currentLanguage,
  showLanguageMenu,
  onInputChange,
  onSend,
  onToggleListening,
  onToggleVoice,
  onClearChat,
  onLanguageSelect,
  onToggleLanguageMenu,
  onKeyPress,
  supportedLanguages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to format structured responses
  const formatMessage = (content: string) => {
    // Simple Markdown-like formatting
    if (!content.includes('###')) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    
    // Process structured content with headers and lists
    const sections = content.split('###').filter(Boolean);
    
    return (
      <div className="space-y-3">
        {sections.map((section, index) => {
          const [title, ...contentLines] = section.trim().split('\n').filter(Boolean);
          const contentText = contentLines.join('\n');
          
          return (
            <div key={index} className="space-y-2">
              <h3 className="font-bold text-lg">{title}</h3>
              <div className="whitespace-pre-wrap">{contentText}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{getLocalizedText("AI Assistant", currentLanguage)}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleLanguageMenu} 
              aria-label={getLocalizedText("Change Language", currentLanguage)}
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                {Object.keys(supportedLanguages).map((lang) => (
                  <button
                    key={lang}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => onLanguageSelect(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleVoice} 
            aria-label={voiceEnabled ? getLocalizedText("Disable voice", currentLanguage) : getLocalizedText("Enable voice", currentLanguage)}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClearChat} 
            aria-label={getLocalizedText("Clear chat", currentLanguage)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-medishare-orange text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.role === "assistant" ? formatMessage(message.content) : message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            placeholder={getLocalizedText("Type your message...", currentLanguage)}
            className="resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={onToggleListening}
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className="h-10 w-10"
              aria-label={isListening ? getLocalizedText("Stop listening", currentLanguage) : getLocalizedText("Start listening", currentLanguage)}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              onClick={onSend}
              disabled={!input.trim()}
              variant="default"
              size="icon"
              className="bg-medishare-orange hover:bg-medishare-gold h-10 w-10"
              aria-label={getLocalizedText("Send message", currentLanguage)}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
