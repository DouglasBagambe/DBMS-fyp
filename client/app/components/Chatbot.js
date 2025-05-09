import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  AlertTriangle,
  Settings,
  HelpCircle,
  Shield,
  Cpu,
  FileText,
  User,
  Clock,
  Camera,
  Activity,
  Database,
  Lock,
  Server,
  AlertCircle,
  Zap,
  Users,
} from "lucide-react";

// Advanced NLP processor with keyword matching and context awareness
const nlpProcessor = {
  processInput: (input, conversationHistory = []) => {
    const lowerInput = input.toLowerCase();

    // Extract keywords from input
    const keywords = {
      installation: [
        "install",
        "camera",
        "setup",
        "mount",
        "connect",
        "hardware setup",
      ],
      alerts: [
        "alert",
        "not working",
        "buzzer",
        "notification",
        "warning",
        "sound",
        "vibration",
      ],
      logs: [
        "log",
        "access",
        "data",
        "report",
        "dashboard",
        "analytics",
        "history",
      ],
      distractions: [
        "distract",
        "detect",
        "behavior",
        "drowsiness",
        "phone",
        "texting",
        "eating",
        "talking",
      ],
      data: [
        "data",
        "storage",
        "database",
        "store",
        "save",
        "record",
        "mysql",
        "cloud",
      ],
      thresholds: [
        "threshold",
        "customize",
        "sensitivity",
        "parameter",
        "setting",
        "configure",
      ],
      hardware: [
        "hardware",
        "camera",
        "arduino",
        "equipment",
        "device",
        "component",
        "physical",
      ],
      failure: [
        "fail",
        "error",
        "issue",
        "report",
        "problem",
        "troubleshoot",
        "help",
      ],
      privacy: [
        "privacy",
        "secure",
        "confidential",
        "protect",
        "consent",
        "law",
        "regulation",
      ],
      performance: [
        "performance",
        "accuracy",
        "speed",
        "reliable",
        "detection rate",
        "continuous",
      ],
      team: ["team", "developer", "who", "create", "made", "built"],
      mission: ["mission", "purpose", "goal", "aim", "objective", "why"],
    };

    // Check for context from previous messages (basic)
    let contextTopic = null;
    if (conversationHistory.length > 0) {
      const lastBotMessage = conversationHistory
        .filter((msg) => msg.role === "bot")
        .pop();
      if (lastBotMessage && lastBotMessage.topic) {
        contextTopic = lastBotMessage.topic;
      }
    }

    // Match topic based on keywords
    let topicScores = {};
    Object.keys(keywords).forEach((topic) => {
      topicScores[topic] = 0;
      keywords[topic].forEach((keyword) => {
        if (lowerInput.includes(keyword)) {
          topicScores[topic] += 1;
          // Give higher weight to exact matches
          if (
            lowerInput.includes(" " + keyword + " ") ||
            lowerInput.startsWith(keyword + " ") ||
            lowerInput.endsWith(" " + keyword)
          ) {
            topicScores[topic] += 0.5;
          }
        }
      });
    });

    // Add context boost
    if (contextTopic && topicScores[contextTopic] > 0) {
      topicScores[contextTopic] += 0.5;
    }

    // Find topic with highest score
    let bestTopic = "default";
    let bestScore = 0;

    Object.keys(topicScores).forEach((topic) => {
      if (topicScores[topic] > bestScore) {
        bestScore = topicScores[topic];
        bestTopic = topic;
      }
    });

    // For very short, ambiguous questions ("how?", "why?"), rely more on context
    if (input.length < 10 && bestScore < 1 && contextTopic) {
      return contextTopic;
    }

    return bestScore > 0 ? bestTopic : "default";
  },
};

// Extensive response database with formatted answers
const responseDatabase = {
  installation: {
    text: "The DBMS camera should be mounted with clear driver view and connected to the Arduino board. Follow these steps:\n\n1. Mount camera at eye level (20-30cm from driver's face)\n2. Connect camera to Arduino via the provided USB cable\n3. Connect Arduino to vehicle power supply (12V)\n4. Secure all cables with cable ties to prevent disconnection\n5. Test system with the built-in diagnostics tool\n\nReference: SRS 2.6, SRS 3.2",
    icon: <Camera className="text-blue-500" />,
  },

  alerts: {
    text: "If your alerts aren't working, please try these troubleshooting steps:\n\n1. Check camera position - ensure clear view of driver's face\n2. Verify power connections to Arduino (green LED should be on)\n3. Test internet connectivity for data transmission (SRS 3.4)\n4. Restart the system by disconnecting power for 30 seconds\n5. Check buzzer connections on the Arduino board (pins 8-9)\n\nIf issues persist, contact support@dbms.com with vehicle ID and error logs.",
    icon: <AlertCircle className="text-orange-500" />,
  },

  logs: {
    text: "To access system logs and reports:\n\n1. Log into the web interface at dashboard.dbms.com\n2. Navigate to Analytics > Driver Logs\n3. Select your fleet and driver IDs\n4. Apply date range filters as needed\n5. Generate reports in PDF, CSV or Excel formats\n\nYou can also schedule automated weekly reports by setting up a reporting rule. Note: You need fleet manager access permissions (SRS REQ-8).",
    icon: <FileText className="text-gray-700" />,
  },

  distractions: {
    text: "The DBMS detects several critical driver distractions with high accuracy:\n\n• Drowsiness: Eyes closed >3 seconds (Viola-Jones algorithm)\n• Phone usage: Hand near face with object (AlexNet CNN)\n• Eating/drinking: Repetitive hand-to-mouth motions\n• Passenger interaction: Head turned >5 seconds\n\nAll detections use computer vision with 85%+ accuracy and <5s processing time (SRS 4.1, REQ-2, REQ-3).",
    icon: <Activity className="text-red-500" />,
  },

  data: {
    text: "DBMS data management follows these protocols:\n\n• Local storage: MySQL database on the vehicle system (SRS REQ-6)\n• Cloud sync: Encrypted transmission to central server (SRS 5.3)\n• Retention: All data kept for one year per regulations (SRS REQ-9)\n• Backup: Automatic daily backups to prevent data loss\n• Access control: Role-based permissions for data access\n\nAll storage complies with safety regulations and data protection standards.",
    icon: <Database className="text-purple-600" />,
  },

  thresholds: {
    text: "The DBMS uses these detection thresholds:\n\n• Drowsiness: Eyes closed for >3 seconds\n• Phone usage: Hand with device near face for >2 seconds\n• Eating: Hand-to-mouth motions >3 times in 10 seconds\n• Passenger interaction: Head turned >5 seconds\n\nThese thresholds are predefined based on safety research but may be adjusted in future updates (SRS Appendix C, TBD-1). Contact support for specific requirements.",
    icon: <Settings className="text-gray-600" />,
  },

  hardware: {
    text: "The DBMS requires these hardware components:\n\n• HD Camera: 1080p with low-light capability\n• Arduino Mega 2560 board (or compatible)\n• Piezoelectric buzzer for alerts\n• Processing unit with GPU support for AI\n• Secure mounting brackets and cabling\n\nAll components must be installed according to guidelines in SRS 3.2 and SRS 2.4. The system requires 12V vehicle power and draws approximately 5W during operation.",
    icon: <Cpu className="text-green-600" />,
  },

  failure: {
    text: "To report a system failure:\n\n1. Note the error code displayed (if any)\n2. Document when the failure occurred\n3. Take photos of any physical issues\n4. Submit details to support@dbms.com\n5. For urgent issues, call +256 123 456 789 (9 AM - 5 PM EAT)\n\nInclude your vehicle ID and error logs from the system diagnostics menu (SRS 6.4).",
    icon: <AlertTriangle className="text-yellow-500" />,
  },

  privacy: {
    text: "DBMS protects driver privacy through:\n\n• End-to-end encryption of all data (SRS 5.3)\n• Explicit driver consent requirement\n• Data use limited to safety purposes only\n• Compliance with Ugandan data protection laws\n• Automatic data purging after retention period\n• No continuous video recording - only event snapshots\n\nRefer to SRS 6.1 and 6.2 for complete privacy framework details.",
    icon: <Shield className="text-blue-700" />,
  },

  performance: {
    text: "DBMS performance specifications:\n\n• Detection accuracy: >90% in various lighting conditions\n• Processing latency: <5 seconds from detection to alert\n• Continuous operation: 10+ hours without rebooting\n• False positive rate: <5% with proper installation\n• Scalability: Supports monitoring of hundreds of vehicles\n\nThe system meets all performance requirements detailed in SRS 5.1.",
    icon: <Zap className="text-yellow-600" />,
  },

  team: {
    text: "The DBMS was developed by Group BSE 25-15:\n\n• Barisigara Simon\n• Shema Collins\n• Namayanja Patricia Linda\n• Ainamaani Douglas Bagambe\n\nThis talented team of software engineers created the system as part of their BSE 4100 Software Engineering Project. See the complete team information on SRS Page 1.",
    icon: <Users className="text-indigo-500" />,
  },

  mission: {
    text: "The DBMS mission is to enhance road safety by detecting unsafe driver behaviors in real-time. Our goals include:\n\n• Reducing accidents caused by driver distraction by 30%\n• Providing accountability and data-driven insights\n• Creating a safer environment for all road users\n• Supporting the implementation of safety regulations\n\nRead more about our mission and vision in SRS 1.1.1 through 1.1.4.",
    icon: <HelpCircle className="text-red-600" />,
  },

  default: {
    text: "I'm DBot, your Driver Behavior Monitoring System assistant! I can help with:\n\n• Installation and setup procedures\n• Alert system troubleshooting\n• Accessing logs and reports\n• Understanding detected distractions\n• Data storage and privacy\n• System thresholds and sensitivity\n• Hardware requirements\n• Reporting failures\n• Performance specifications\n• Our development team and mission\n\nHow can I assist you today?",
    icon: <HelpCircle className="text-blue-500" />,
  },
};

// Message bubble component with typing animation and rich formatting
const MessageBubble = ({ message }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(message.role === "bot");

  useEffect(() => {
    if (message.role === "bot" && isTyping) {
      let i = 0;
      const typingSpeed = 15; // milliseconds per character
      const interval = setInterval(() => {
        if (i < message.text.length) {
          setDisplayText(message.text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    }
  }, [message, isTyping]);

  return (
    <div
      className={`relative p-4 rounded-2xl shadow ${
        message.role === "user"
          ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white ml-auto"
          : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800"
      } max-w-[90%] mb-4`}
    >
      {message.role === "bot" && message.icon && (
        <div className="absolute -left-2 -top-2 bg-white p-1 rounded-full shadow">
          {message.icon}
        </div>
      )}
      {message.role === "user" && (
        <div className="absolute -right-2 -top-2 bg-blue-600 p-1 rounded-full shadow">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="whitespace-pre-line">
        {message.role === "bot" && isTyping ? displayText : message.text}
        {message.role === "bot" && isTyping && (
          <span className="inline-block animate-pulse">▌</span>
        )}
      </div>
      <div className="text-xs opacity-70 text-right mt-1">
        {message.timestamp}
      </div>
    </div>
  );
};

// Topic suggestion button with icon
const SuggestionButton = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 bg-white hover:bg-gray-50 rounded-full shadow hover:shadow-md transition-all duration-300 text-sm font-medium text-gray-700 border border-gray-200"
    >
      {icon}
      <span className="ml-2 truncate">{label}</span>
    </button>
  );
};

// Custom Target icon since it's not in lucide-react
const Target = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

// Main Chatbot Component with advanced features
const Chatbot = ({ isOpen, onClose }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeTopic, setActiveTopic] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Format current timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // Focus input field when chat opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, chatMessages]);

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen) {
      setChatMessages([
        {
          role: "bot",
          text: "Hello! I'm DBot, your assistant for the Driver Behavior Monitoring System. How can I help you today?",
          timestamp: getTimestamp(),
          icon: responseDatabase.default.icon,
          topic: "default",
        },
      ]);
      setShowSuggestions(true);
    }
  }, [isOpen]);

  const handleChatSend = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = {
      role: "user",
      text: userInput,
      timestamp: getTimestamp(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setShowSuggestions(false);

    // Process user input with NLP
    setTimeout(() => {
      const topic = nlpProcessor.processInput(userInput, chatMessages);
      setActiveTopic(topic);

      const response = responseDatabase[topic];
      const botResponse = {
        role: "bot",
        text: response.text,
        timestamp: getTimestamp(),
        icon: response.icon,
        topic: topic,
      };

      setChatMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);

      // Show suggestions again after bot responds
      setTimeout(() => {
        setShowSuggestions(true);
      }, 1000);
    }, 800); // Slight delay to simulate processing

    setUserInput("");
  };

  const handleSuggestionClick = (topic) => {
    // Map topics to natural language questions
    const topicQuestions = {
      installation: "How do I install the camera system?",
      alerts: "My alert system isn't working properly",
      logs: "How can I access the driver behavior logs?",
      distractions: "What driver distractions does the system detect?",
      data: "How is driver data stored and managed?",
      thresholds: "What are the detection thresholds?",
      hardware: "What hardware components are required?",
      failure: "How do I report a system failure?",
      privacy: "How is driver privacy protected?",
      performance: "What's the system's detection accuracy?",
    };

    setUserInput(topicQuestions[topic] || "");
    inputRef.current?.focus();
  };

  // Generate smart suggestions based on conversation context
  const getSuggestions = () => {
    // Default suggestions
    let suggestions = [
      { topic: "installation", label: "Installation" },
      { topic: "distractions", label: "Distractions" },
      { topic: "privacy", label: "Privacy" },
    ];

    // Context-aware suggestions based on last bot message
    if (chatMessages.length > 0) {
      const lastBotMessage = [...chatMessages]
        .reverse()
        .find((msg) => msg.role === "bot");

      if (lastBotMessage) {
        switch (lastBotMessage.topic) {
          case "installation":
            suggestions = [
              { topic: "hardware", label: "Hardware needed" },
              { topic: "alerts", label: "Alert setup" },
              { topic: "failure", label: "Installation issues" },
            ];
            break;
          case "alerts":
            suggestions = [
              { topic: "failure", label: "Report problem" },
              { topic: "hardware", label: "Check hardware" },
              { topic: "thresholds", label: "Alert sensitivity" },
            ];
            break;
          case "distractions":
            suggestions = [
              { topic: "thresholds", label: "Detection settings" },
              { topic: "performance", label: "Detection accuracy" },
              { topic: "logs", label: "View detections" },
            ];
            break;
          case "privacy":
            suggestions = [
              { topic: "data", label: "Data storage" },
              { topic: "logs", label: "Access controls" },
              { topic: "team", label: "Development team" },
            ];
            break;
          // Add more context-specific suggestions
        }
      }
    }

    return suggestions;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h3 className="text-lg font-bold flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          DBMS Assistant
        </h3>
        <div className="flex items-center space-x-2">
          <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
          <span className="text-xs text-green-200">Online</span>
          <button
            onClick={onClose}
            className="ml-2 text-white hover:bg-blue-700/50 p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {chatMessages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 p-2 text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span className="text-sm">DBot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && !isLoading && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Suggested topics:
          </p>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {getSuggestions().map((suggestion, index) => (
              <SuggestionButton
                key={index}
                icon={
                  responseDatabase[suggestion.topic]?.icon || (
                    <HelpCircle className="w-4 h-4" />
                  )
                }
                label={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion.topic)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleChatSend}
        className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me about DBMS..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="text-xs text-center text-gray-400 mt-2">
          Powered by DBMS - Driver Behavior Monitoring System
        </div>
      </form>
    </div>
  );
};

export default Chatbot;

// Demo component wrapper
// const ChatbotDemo = () => {
//   const [isOpen, setIsOpen] = useState(true);

//   return (
//     <div className="relative w-full h-screen bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
//         >
//           <MessageCircle className="w-6 h-6" />
//         </button>
//       )}

//       <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />

//       <div className="absolute bottom-4 left-4 text-sm text-gray-500 dark:text-gray-400">
//         Demo: Driver Behavior Monitoring System Chatbot
//       </div>
//     </div>
//   );
// };

// export default ChatbotDemo;
