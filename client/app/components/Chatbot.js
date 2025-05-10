/* eslint-disable @next/next/no-img-element */
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
  const [expandedMode, setExpandedMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

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
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
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

      // Check user's preferred color scheme
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setDarkMode(true);
      }

      // Add event listener for resize to adjust mobile view
      const handleResize = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setExpandedMode(true);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [isOpen]);

  const handleChatSend = (e) => {
    e?.preventDefault();
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

      // Show suggestions again after bot responds but with a delay
      setTimeout(() => {
        setShowSuggestions(true);
      }, 1500);
    }, 800); // Slight delay to simulate processing

    setUserInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
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
      team: "Who developed this system?",
      mission: "What's the purpose of DBMS?",
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
          case "logs":
            suggestions = [
              { topic: "data", label: "Data storage" },
              { topic: "privacy", label: "Access permissions" },
              { topic: "performance", label: "System speed" },
            ];
            break;
          case "team":
            suggestions = [
              { topic: "mission", label: "Project purpose" },
              { topic: "performance", label: "System capabilities" },
              { topic: "privacy", label: "Data handling" },
            ];
            break;
          case "mission":
            suggestions = [
              { topic: "team", label: "Meet the team" },
              { topic: "distractions", label: "Detection capabilities" },
              { topic: "performance", label: "System accuracy" },
            ];
            break;
          default:
            suggestions = [
              { topic: "installation", label: "Installation" },
              { topic: "distractions", label: "Distractions" },
              { topic: "team", label: "Development team" },
            ];
        }
      }
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions for mobile-friendliness
  };

  const toggleChatExpansion = () => {
    setExpandedMode(!expandedMode);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  if (!isOpen) return null;

  // Determine size classes based on expanded mode and screen size
  const chatSizeClasses = expandedMode
    ? "fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-112 md:h-144"
    : "fixed bottom-4 right-4 w-80 h-96 md:w-96 md:h-128";

  // Dynamic theme classes
  const themeClasses = darkMode
    ? "bg-gray-900 text-gray-200"
    : "bg-white text-gray-800";

  const headerClasses = darkMode
    ? "bg-gradient-to-r from-blue-800 to-indigo-900 text-white"
    : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white";

  const inputBgClasses = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-200 focus:ring-blue-600"
    : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500";

  const suggestionsClasses = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-gray-50 border-gray-200";

  const buttonHoverClasses = darkMode
    ? "hover:bg-gray-700"
    : "hover:bg-gray-100";

  const chatBgClasses = darkMode
    ? "bg-gradient-to-b from-gray-900 to-gray-800"
    : "bg-gradient-to-b from-slate-50 to-gray-100";

  return (
    <div
      className={`${chatSizeClasses} ${themeClasses} rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center p-3 ${headerClasses} sticky top-0`}
      >
        <div className="flex items-center space-x-2">
          <img
            src="/dbms-logo1.svg"
            alt="DBMS Logo"
            className="w-8 h-8 rounded-lg"
          />
          <h3 className="text-lg font-bold">DBMS Assistant</h3>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            <span className="text-xs text-green-200 hidden md:inline">
              Online
            </span>
          </div>

          <button
            onClick={toggleSettings}
            className={`text-white p-1.5 rounded-full transition-all ${buttonHoverClasses}`}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleChatExpansion}
            className={`text-white p-1.5 rounded-full transition-all ${buttonHoverClasses}`}
            aria-label="Toggle chat size"
          >
            {expandedMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-minimize-2"
              >
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-maximize-2"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            )}
          </button>

          <button
            onClick={onClose}
            className={`text-white p-1.5 rounded-full transition-all ${buttonHoverClasses}`}
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel (conditionally rendered) */}
      {showSettings && (
        <div
          className={`p-3 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div
                className={`p-1 rounded ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <Cpu className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Chat Settings</span>
            </div>
            <button
              onClick={toggleSettings}
              className={`p-1 rounded-full ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-500"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <span className="text-xs">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-11 h-6 flex items-center rounded-full p-1 ${
                  darkMode ? "bg-blue-600" : "bg-gray-300"
                } transition-colors duration-300 focus:outline-none`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-300 ${
                    darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-3 ${chatBgClasses} scroll-smooth relative`}
      >
        <div className="max-w-4xl mx-auto">
          {chatMessages.map((msg, index) => (
            <MessageBubble key={index} message={msg} darkMode={darkMode} />
          ))}
          {isLoading && (
            <div
              className={`flex items-center space-x-2 p-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="flex space-x-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    darkMode ? "bg-gray-500" : "bg-gray-400"
                  } animate-bounce`}
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    darkMode ? "bg-gray-500" : "bg-gray-400"
                  } animate-bounce`}
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    darkMode ? "bg-gray-500" : "bg-gray-400"
                  } animate-bounce`}
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <span className="text-sm">DBot is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions (Collapsible on mobile) */}
      {showSuggestions && !isLoading && (
        <div
          className={`px-3 py-2 ${suggestionsClasses} border-t overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="flex justify-between items-center mb-1">
            <p
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Suggested topics:
            </p>
          </div>
          <div className="flex flex-wrap gap-1 pb-1">
            {getSuggestions().map((suggestion, index) => (
              <SuggestionButton
                key={index}
                icon={
                  responseDatabase[suggestion.topic]?.icon || (
                    <HelpCircle className="w-3 h-3" />
                  )
                }
                label={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion.topic)}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleChatSend}
        className={`p-3 ${themeClasses} border-t ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about DBMS..."
            className={`flex-1 px-4 py-2 border rounded-full ${inputBgClasses} focus:outline-none focus:ring-2 transition-all duration-200`}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className={`p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 ${
              !userInput.trim() ? "" : "animate-pulse"
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div
          className={`text-xs text-center mt-2 ${
            darkMode ? "text-gray-500" : "text-gray-400"
          } font-light`}
        >
          Powered by DBMS - Driver Behavior Monitoring System
        </div>
      </form>
    </div>
  );
};

// Updated Message Bubble component with improved styling and dark mode support
const MessageBubble = ({ message, darkMode }) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(message.role === "bot");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (message.role === "bot" && isTyping) {
      let i = 0;
      const typingSpeed = 10; // faster typing
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

  // Check if message is long enough to need expansion
  const isLongMessage = message.text.length > 300;

  // Get bubble gradient based on role and dark mode
  const getBubbleClasses = () => {
    if (message.role === "user") {
      return darkMode
        ? "bg-gradient-to-br from-blue-700 to-blue-900 text-white ml-auto"
        : "bg-gradient-to-br from-blue-500 to-blue-700 text-white ml-auto";
    } else {
      return darkMode
        ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800";
    }
  };

  return (
    <div
      className={`relative p-3 rounded-2xl shadow-lg ${getBubbleClasses()} max-w-[90%] mb-3 transition-all duration-300`}
    >
      {message.role === "bot" && message.icon && (
        <div
          className={`absolute -left-1.5 -top-1.5 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } p-1.5 rounded-full shadow-md`}
        >
          {message.icon}
        </div>
      )}
      {message.role === "user" && (
        <div className="absolute -right-1.5 -top-1.5 bg-blue-700 p-1.5 rounded-full shadow-md">
          <User className="w-3 h-3 text-white" />
        </div>
      )}
      <div
        className={`whitespace-pre-line ${
          isLongMessage && !isExpanded
            ? "max-h-48 overflow-hidden relative"
            : ""
        }`}
      >
        {message.role === "bot" && isTyping ? displayText : message.text}
        {message.role === "bot" && isTyping && (
          <span className="inline-block animate-pulse">▌</span>
        )}

        {/* Gradient overlay for long messages */}
        {isLongMessage && !isExpanded && (
          <div
            className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t ${
              message.role === "user"
                ? darkMode
                  ? "from-blue-800"
                  : "from-blue-600"
                : darkMode
                ? "from-gray-800"
                : "from-gray-100"
            } to-transparent`}
          ></div>
        )}
      </div>

      {/* Expand button for long messages */}
      {isLongMessage && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-xs mt-1 font-medium ${
            message.role === "user"
              ? "text-blue-200"
              : darkMode
              ? "text-gray-400"
              : "text-gray-500"
          } hover:underline flex items-center`}
        >
          {isExpanded ? "Show less" : "Read more"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-1 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      )}

      <div
        className={`text-xs opacity-70 text-right mt-1 ${
          message.role === "user"
            ? "text-blue-100"
            : darkMode
            ? "text-gray-400"
            : "text-gray-500"
        }`}
      >
        {message.timestamp}
      </div>
    </div>
  );
};

// Updated Suggestion Button with improved compact design
const SuggestionButton = ({ icon, label, onClick, darkMode }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center px-2 py-1.5 ${
        darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
      } rounded-lg shadow-sm hover:shadow transition-all duration-200 text-xs font-medium ${
        darkMode ? "text-gray-200" : "text-gray-700"
      } border ${
        darkMode ? "border-gray-600" : "border-gray-200"
      } transform active:scale-95`}
    >
      <div
        className={`${
          darkMode ? "text-blue-400" : "text-blue-500"
        } mr-1.5 transition-all duration-200 group-hover:scale-110`}
      >
        {icon}
      </div>
      <span className="truncate max-w-[120px]">{label}</span>
    </button>
  );
};

export default Chatbot;
