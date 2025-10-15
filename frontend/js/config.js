window.CONFIG = {
  brand: "AI Agents",
  bots: [
    {
      id: "setter",
      label: "Appointment Setter",
      side: "top",
      tip: "Books intros, qualifies leads, reads calendars.",
      examples: [
        "Hello, I'd like a 30-minute intro next week. Budget is £2k per month.",
        "Could you do Tuesday 2–4pm?",
        "Use alex@example.com for the invite."
      ],
      intro: "Hi — ask me about appointment setting, availability and basic qualification and I’ll help."
    },
    {
      id: "support",
      label: "Support Q&A",
      side: "right",
      tip: "Helps with returns, delivery and warranty.",
      examples: [
        "Try: nuanced returns",
        "Try: shipping speed",
        "Try: weekend hours"
      ],
      intro: "Hi — ask me about returns, shipping, warranty or support hours and I’ll answer from policy."
    },
    {
      id: "internal",
      label: "Internal Knowledge",
      side: "left",
      tip: "Answers HR and Sales questions clearly.",
      examples: [
        "How many holidays do we have?",
        "What is the SDR lead handoff?",
        "What’s our parental leave policy?"
      ],
      intro: "Hi — ask me about HR, Sales or general internal knowledge."
    },
    {
      id: "planner",
      label: "Automation Planner",
      side: "bottom",
      tip: "Designs workflows across your tools.",
      examples: [
        "Connect CRM to Slack for new deals.",
        "Draft onboarding workflow in n8n.",
        "Sync Zendesk tags to the data warehouse."
      ],
      intro: "Hi — describe the workflow you want and I’ll plan the steps and tools."
    }
  ]
};
