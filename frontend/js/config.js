window.APP_CONFIG = {
  bots: {
    appointment: {
      title: "Appointment Setter",
      prompts: [
        "Hello, I'd like a 30-minute intro next week. Budget is £2k per month.",
        "Could you do Tuesday 2–4pm?",
        "Use alex@example.com for the invite."
      ],
      tip: "Books qualified meetings straight into your calendar."
    },
    internal: {
      title: "Internal Knowledge",
      prompts: [
        "Holiday policy summary",
        "New-starter checklist",
        "Quarterly targets"
      ],
      tip: "Answers HR and Sales questions clearly from your docs."
    },
    support: {
      title: "Support Q&A",
      prompts: [
        "Nuanced returns",
        "Shipping speed",
        "Weekend hours"
      ],
      tip: "Helps with returns, delivery and warranty."
    },
    automation: {
      title: "Automation Planner",
      prompts: [
        "Connect CRM to Slack when cases close",
        "Weekly data export to Sheets",
        "Onboarding workflow"
      ],
      tip: "Designs an automation plan from your brief."
    }
  }
};
