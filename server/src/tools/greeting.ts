import { z } from "zod";

// 1. Define Zod schema for input validation
export const GreetingToolSchema = z.object({
  name: z.string().describe("The name to greet"),
});

// 2. Tool definition for MCP Server
export const greetingToolDefinition = {
  description: "Returns a greeting message",
  inputSchema: {
    name: z.string().describe("The name to greet"),
  },
};

// 3. Tool implementation
// Handler needs to match the expected signature from McpServer
export const handleGreeting = (args: unknown, extra?: any) => {
  // Validate the input
  const validated = GreetingToolSchema.parse(args);
  const { name } = validated;

  // Return formatted response with properly typed content
  return {
    content: [
      {
        type: "text" as const,  // Type assertion to make TypeScript happy
        text: `Hello, ${name}! Welcome to the Model Context Protocol.`,
      },
    ],
  };
};
