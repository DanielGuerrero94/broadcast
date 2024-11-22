// See: https://docs.deno.com/examples/os-signals/
const handleServerKillSignal = (
  abort: AbortController,
  clients: WebSocket[],
) => {
  const sigIntHandler = () => {
    console.log("Closing clients");
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("shutdown");
      }
    }

    console.log("Closing server with 5000 ms for clients to disconnect");
    setTimeout(() => {
      abort.abort();

      Deno.exit(1);
    }, 5000);
  };
  Deno.addSignalListener("SIGINT", sigIntHandler);
};

const clients: WebSocket[] = [];

// See: https://docs.deno.com/examples/http-server-websocket/
const openWs = () => {
  // See: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
  // And also: https://docs.deno.com/api/deno/~/Deno.serve
  const abort = new AbortController();
  handleServerKillSignal(abort, clients);
  const server = Deno.serve({ signal: abort.signal }, (req) => {
    if (req.headers.get("upgrade") != "websocket") {
      return new Response(null, { status: 501 });
    }
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.addEventListener("open", () => {
      console.log("Adding new client to the pool");
      clients.push(socket);
    });
    socket.addEventListener("message", (event) => {
      if (event.data === "ping") {
        socket.send("pong");
        return;
      }
      // Broadcast the message to all connected clients
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(event.data);
        }
      }
    });
    socket.addEventListener("close", () => {
      console.log("The connection has been closed successfully.");
      console.log("Removing client from pool.");
      clients.splice(clients.indexOf(socket), 1);
    });
    socket.addEventListener("error", (event) => {
      console.log("WebSocket error: ", event);
    });

    return response;
  });
  server.finished.then(() => console.log("Server closed"));
};

// See: https://docs.deno.com/examples/os-signals/
const handleClientKillSignal = (socket: WebSocket) => {
  const sigIntHandler = () => {
    console.log("Closing websocket");
    // See: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
    socket.close();
  };
  Deno.addSignalListener("SIGINT", sigIntHandler);
};

// See: https://docs.deno.com/examples/websocket/
export const connectToWs = () => {
  const socket = new WebSocket("ws://localhost:8000");
  handleClientKillSignal(socket);
  socket.addEventListener("open", () => {
    if (socket.readyState !== WebSocket.OPEN) return;
    socket.send("ping");
    setTimeout(() => socket.send("HI"), 2000);
  });
  socket.addEventListener("message", (event) => {
    if (event.data === "shutdown") {
      console.log("Server is shutting down.");
      socket.close();
    }
    console.log(event.data);
  });
  socket.addEventListener("close", () => {
    console.log("The connection has been closed successfully.");
    Deno.exit();
  });
  socket.addEventListener("error", (event) => {
    const connectionRefused = event instanceof ErrorEvent &&
      event.message.startsWith("NetworkError");
    if (connectionRefused) {
      console.log("WebSocket error: ", event.error);
      Deno.exit(1);
    }
    const poorlyClosedSocket = event instanceof ErrorEvent &&
      event.message === "Unexpected EOF";
    if (poorlyClosedSocket) {
      console.log("WebSocker error: Server stopped without waiting");
      Deno.exit(1);
    }
    console.log("WebSocket error: ", event);
    Deno.exit(1);
  });
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const action = Deno.args[0];
  if (action === "start") {
    console.log("start ws");
    openWs();
  } else {
    console.log("connect to ws");
    connectToWs();
  }
}
