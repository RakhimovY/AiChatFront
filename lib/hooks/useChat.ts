/**
 * Custom hook for chat functionality
 */
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Message } from "@/components/chat/types";
import { sendMessage, convertToFrontendMessage, getChatHistory } from "@/lib/chatApi";

interface UseChatOptions {
  pollingInterval?: number;
}

export function useChat(options: UseChatOptions = {}) {
  const { pollingInterval = 5000 } = options;
  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

  // State for messages, loading state, and chat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: t.welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    session?.user?.country || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNewChat, setIsNewChat] = useState(false);

  // Fetch chat history when the component mounts or when the chat ID changes
  useEffect(() => {
    // Skip if not authenticated or no chat ID
    if (status !== "authenticated" || !currentChatId) {
      return;
    }

    const fetchChatHistory = async () => {
      // Only show loading state if it's not a new chat
      if (!isNewChat) {
        setIsLoadingHistory(true);
      }
      setError(null);
      try {
        const chatHistory = await getChatHistory(currentChatId);
        if (chatHistory.length > 0) {
          const frontendMessages = chatHistory.map(convertToFrontendMessage);
          setMessages(frontendMessages);
        }
        // Reset the new chat flag after fetching
        setIsNewChat(false);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError(t.errorLoading);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchChatHistory();
  }, [currentChatId, status, language, isNewChat, t]);

  // Update welcome message when language changes
  useEffect(() => {
    // Only update if there's no active chat (showing welcome message)
    if (!currentChatId) {
      // Check messages state without adding it as a dependency
      const isWelcomeMessageOnly = 
        messages.length === 1 && messages[0].id === "welcome";

      if (isWelcomeMessageOnly) {
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: t.welcomeMessage,
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [language, t, currentChatId]);

  // Poll for new messages
  useEffect(() => {
    // Skip if not authenticated, no chat ID, or loading
    if (status !== "authenticated" || !currentChatId || isLoading) {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const chatHistory = await getChatHistory(currentChatId);
        if (chatHistory.length > 0) {
          const frontendMessages = chatHistory.map(convertToFrontendMessage);
          // Only update if there are new messages
          if (frontendMessages.length > messages.length) {
            setMessages(frontendMessages);
          }
        }
        // Clear any previous errors if successful
        if (error) {
          setError(null);
        }
      } catch (error) {
        console.error("Error polling for new messages:", error);

        // Check if it's an authentication error (401)
        const isAuthError = (error as any)?.response?.status === 401;

        if (isAuthError) {
          // For auth errors, set a specific error message but don't disrupt the experience
          setError(t.errorAuth);
        }
        // For other errors, don't show error messages to avoid disrupting the user experience
      }
    }, pollingInterval);

    return () => clearInterval(pollInterval);
  }, [currentChatId, status, isLoading, messages.length, error, language, t, pollingInterval]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    // Generate a unique ID for the message
    const userMessageId = Date.now().toString();

    // Add user message to the chat
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setError(null);
    try {
      // Use the backend API for authenticated users
      if (status === "authenticated") {
        const response = await sendMessage(
          currentChatId
            ? {
                chatId: currentChatId,
                content: input,
                country: selectedCountry,
                language,
                document: selectedFile,
              }
            : {
                content: input,
                country: selectedCountry,
                language,
                document: selectedFile,
              }
        );

        // Update the current chat ID if this is a new chat
        if (!currentChatId && response.length > 0) {
          setCurrentChatId(response[0].chatId);
          // Set the flag to indicate this is a new chat
          setIsNewChat(true);
        }

        // Convert backend messages to frontend format and update the state
        const frontendMessages = response.map(convertToFrontendMessage);
        setMessages(frontendMessages);
        setIsLoading(false);

        // Clear the selected file after sending
        setSelectedFile(null);
      } else {
        // For unauthenticated users, show an error message
        setError(t.errorAuth);
        setIsLoading(false);

        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${userMessageId}`,
            role: "assistant",
            content: t.errorAuth,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      setIsLoading(false);

      // Check if it's an authentication error (401)
      const isAuthError = (error as any)?.response?.status === 401;

      // Set appropriate error state
      if (isAuthError) {
        setError(t.errorAuth);
      } else {
        setError(t.errorSending);
      }

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${userMessageId}`,
          role: "assistant",
          content: isAuthError ? t.errorAuth : t.errorSending,
          timestamp: new Date(),
        },
      ]);

      // Clear the selected file on error
      setSelectedFile(null);
    }
  };

  // Clear chat history and start a new chat
  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: t.newChatMessage,
        timestamp: new Date(),
      },
    ]);
    // Reset the current chat ID to allow creating a new chat
    setCurrentChatId(null);
    // Clear input field if there's any text
    setInput("");
  };

  // Export chat history
  const exportChat = () => {
    // Get current date and time for the header
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    // Create a header with metadata
    const chatTitle = currentChatId
      ? messages.length > 0 && messages[0].role === "assistant" && messages[0].id === "welcome"
        ? messages[0].content.split("\n")[0] // Use first line of welcome message as title
        : `Chat #${currentChatId}`
      : t.newChat || "Новый чат";

    const header = [
      `AIuris - ${chatTitle}`,
      `${t.exportedOn || "Экспортировано"}: ${dateStr} ${timeStr}`,
      `${t.messagesCount || "Количество сообщений"}: ${messages.length}`,
      "----------------------------------------",
      "",
    ].join("\n");

    // Format each message with timestamp and role
    const formattedMessages = messages.map((msg) => {
      const msgTime = msg.timestamp.toLocaleTimeString();
      const msgDate = msg.timestamp.toLocaleDateString();
      const role = msg.role === "user" ? t.user || "Вы" : t.assistant || "Ассистент";

      return [
        `[${msgDate} ${msgTime}] ${role}:`,
        msg.content,
        "----------------------------------------",
      ].join("\n");
    });

    // Join all messages with a newline
    const chatContent = formattedMessages.join("\n\n");

    // Add a footer
    const footer = [
      "",
      `${t.exportedWith || "Экспортировано с помощью"} AIuris`,
      `${t.exportDate || "Дата экспорта"}: ${dateStr}`,
    ].join("\n");

    // Combine header, content, and footer
    const chatText = `${header}${chatContent}\n\n${footer}`;

    // Create and download the file
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aiuris-chat-${now.toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    currentChatId,
    setCurrentChatId,
    isLoadingHistory,
    error,
    selectedCountry,
    setSelectedCountry,
    selectedFile,
    setSelectedFile,
    handleSubmit,
    clearChat,
    exportChat,
    status,
  };
}
