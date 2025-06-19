#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { greetingToolDefinition, handleGreeting } from "./tools/greeting.js";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

// Create server info
const serverInfo = {
    name: "obenan-mcp",  // Changed to match your config
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

// Check if we should start in HTTP mode
const useHttp = process.argv.includes("--http");

if (useHttp) {
    // Setup Express and WebSocket
    const app = express();
    const httpServer = http.createServer(app);
    const wss = new WebSocketServer({ server: httpServer });

    // Handle WebSocket connections
    wss.on('connection', (ws) => {
        console.error('Client connected');
        
        // Connect the MCP server to this WebSocket
        server.connect({
            send: (data) => ws.send(data),
            onMessage: (handler) => ws.on('message', (data) => handler(data.toString())),
            close: () => {},
        });
        
        ws.on('close', () => {
            console.error('Client disconnected');
        });
    });
    
    // Add explicit SSE endpoint for Windsurf
    app.get('/', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        console.error('SSE client connected');
        
        // Connect the MCP server to this SSE connection
        const sseTransport = {
            send: (data) => {
                res.write(`data: ${data}\n\n`);
            },
            onMessage: () => {
                // SSE is one-way communication
            },
            close: () => {}
        };
        
        server.connect(sseTransport);
        
        req.on('close', () => {
            console.error('SSE client disconnected');
        });
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, '0.0.0.0', () => {
        console.error(`MCP Server listening on port ${PORT} on all interfaces`);
    });
} else {
    // Connect to stdio transport (original behavior)
    const stdioTransport = new StdioServerTransport();
    server.connect(stdioTransport);
    console.error("MCP Hello World server started in stdio mode");
}