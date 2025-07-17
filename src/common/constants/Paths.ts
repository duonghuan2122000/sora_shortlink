export default {
  Base: "/api",
  /**
   * Health endpoint
   */
  Health: "/health",
  /**
   * Send mail endpoint
   */
  Mails: {
    Base: "/mails",
    Send: "/send",
  },
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
} as const;
