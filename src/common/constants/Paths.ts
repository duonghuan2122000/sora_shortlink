export default {
  Base: "/api",
  /**
   * Health endpoint
   */
  Health: "/health",
  Users: {
    Base: "/users",
    Get: "/all",
    Add: "/add",
    Update: "/update",
    Delete: "/delete/:id",
  },
} as const;
