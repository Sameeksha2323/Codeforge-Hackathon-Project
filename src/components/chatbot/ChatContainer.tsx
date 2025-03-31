
import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import ChatInterface from "./ChatInterface";
import { ChatMessage } from "@/types/chatbot";

interface ChatContainerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
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

const ChatContainer: React.FC<ChatContainerProps> = ({
  isOpen,
  setIsOpen,
  isMobile,
  ...chatInterfaceProps
}) => {
  // Common chat interface component to be rendered in either mobile or desktop container
  const chatInterface = <ChatInterface {...chatInterfaceProps} />;

  // Different container components based on screen size
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-medishare-orange hover:bg-medishare-gold"
            size="icon"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[90vh]">
          {chatInterface}
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-medishare-orange hover:bg-medishare-gold"
            size="icon"
            aria-label="Open chat"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[450px] sm:max-w-md p-0">
          <div className="h-screen">
            {chatInterface}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
};

export default ChatContainer;
