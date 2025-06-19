#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { greetingToolDefinition, handleGreeting } from "./tools/greeting.js";

// Create server info
const serverInfo = {
  name: "hello-world", 
  version: "1.0.0"
};

// Create the MCP server with tools capability
const server = new McpServer(serverInfo, {
  capabilities: {
    tools: {}
  }
});

// Register our greeting tool
server.registerTool("greeting", greetingToolDefinition, handleGreeting);

// Connect to stdio transport
const stdioTransport = new StdioServerTransport();
server.connect(stdioTransport);

// Log that the server has started
console.error("MCP Hello World server started");

