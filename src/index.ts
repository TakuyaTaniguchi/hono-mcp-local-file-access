import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { StreamableHTTPTransport } from '@hono/mcp'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {ucs2} from "node:punycode";

const app = new Hono()

const mcpServer = new McpServer({
  name: 'hono-mcp-server-file-api',
    version: '1.0.0',
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.all('/mcp', async (c) => {
  const transport = new StreamableHTTPTransport()
  await mcpServer.connect( transport)
  return transport.handleRequest(c)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
