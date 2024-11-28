# Broadcast Server

[![JSR Scope](https://jsr.io/badges/@dannyden)](https://jsr.io/@dannyden)
[![JSR](https://jsr.io/badges/@dannyden/broadcast)](https://jsr.io/@dannyden/broadcast)
[![JSR Score](https://jsr.io/badges/@dannyden/broadcast/score)](https://jsr.io/@dannyden/broadcast)
Build a server that can broadcast messages to connected clients.

Project listed on [Roadmap.sh](https://roadmap.sh/projects/broadcast-server)

# Usage

<!-- usage -->

Using it with Deno

```
curl -fsSL https://deno.land/install.sh | sh

deno run jsr:@dannyden/broadcast start
deno run jsr:@dannyden/broadcast connect roadmap
```

Using it from PATH

```sh-session
$ broadcast start
...starting ws
✅ Granted net access to "0.0.0.0:8000".
Listening on http://0.0.0.0:8000/
Adding new client to the pool
$ broadcast connect roadmap
...connecting to ws
┏ ⚠️  Deno requests net access to "localhost:8000".
✅ Granted net access to "localhost:8000".
┏ ⚠️  Deno requests env access to "TERM".
✅ Granted env access to "TERM".
Welcome roadmap
roadmap:
```

<!-- usagestop -->

# Setup

<!-- setup -->

Globally with Deno

```sh
echo "Run without installing it"
deno run jsr:@dannyden/broadcast start

echo "Install with permission checks"
deno install -g -n broadcast jsr:@dannyden/broadcast

echo "Install allowing net"
deno install -g -n broadcast --allow-net jsr:@dannyden/broadcast

echo "Uninstall"
deno uninstall -g broadcast
```

Locally as dependency

```sh
deno add jsr:@dannyden/broadcast
npx jsr add @dannyden/broadcast
yarn dlx jsr add @dannyden/broadcast
pnpm dlx jsr add @dannyden/broadcast
bunx jsr add @dannyden/broadcast
```

<!-- setupstop -->
