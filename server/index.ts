import type { ServerWebSocket } from "bun";

const clients = new Set<ServerWebSocket>();

const server = Bun.serve({
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    async open(ws) {
      clients.add(ws);
      console.log(`Connected ${ws.remoteAddress}`);
    },
    async close(ws, code, reason) {
      clients.delete(ws);
      console.log(`Disconnected ${ws.remoteAddress}`)
    },
    // this is called when a message is received
    async message(ws, message) {
      console.log(`Received ${message}`);

      // send back a message
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);