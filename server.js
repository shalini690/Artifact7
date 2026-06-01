'use strict';

/**
 * Artifact7 — Express.js application entry point
 * ==============================================
 *
 * This is the sole source module of the Artifact7 tutorial project. It boots a
 * minimal HTTP server built on the Express.js framework and exposes two
 * deterministic, plain-text greeting endpoints:
 *
 *   • GET /hello         -> HTTP 200, "Hello world"   (the original endpoint)
 *   • GET /good-evening  -> HTTP 200, "Good evening"  (the newly added endpoint)
 *
 * Design contracts (Technical Specification §5.2 — Application Entry Point,
 * HTTP Server, and Route Handler):
 *
 *   - Framework:      Express.js 5.x, using its declarative routing model. The
 *                     native `node:http` module is intentionally NOT used.
 *   - Module system:  CommonJS (`require`). The companion package.json does not
 *                     declare `"type": "module"`, so this file runs directly via
 *                     `node server.js` (or `npm start`) with no transpilation.
 *   - Content-Type:   Each handler explicitly sets `text/plain`. Express's
 *                     `res.send(<string>)` would otherwise default to
 *                     `Content-Type: text/html; charset=utf-8`; calling
 *                     `res.type('text/plain')` yields `text/plain; charset=utf-8`,
 *                     honoring the documented response contract for both routes.
 *   - Handler purity: Both handlers are synchronous, input-independent, and
 *                     deterministic. They read no request headers, query string,
 *                     or body, perform no I/O, and return bit-identical bytes on
 *                     every call.
 *   - 404 behavior:   Any unmatched path or HTTP method falls through to
 *                     Express's built-in default handler, which returns
 *                     HTTP 404. No custom 404 handling code is required.
 *
 * Scope / minimalism note: this server intentionally omits security middleware
 * (helmet, CORS, rate limiting, TLS), logging frameworks, body parsers,
 * databases, and any dependency other than Express, in keeping with the
 * project's minimalism objective.
 */

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------
// Sole direct runtime dependency. Declared in package.json as `express: ^5.2.0`
// and resolved into node_modules/ by `npm install`.
const express = require('express');

// ---------------------------------------------------------------------------
// Application setup
// ---------------------------------------------------------------------------
// Instantiate the Express application using the express() factory function.
const app = express();

// Listening port. Defaults to the conventional development port 3000 and honors
// an optional `PORT` environment-variable override for flexible local runs.
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /hello — the original, preserved endpoint.
 *
 * Responds with HTTP 200 and the verbatim plain-text body "Hello world". The
 * explicit `res.type('text/plain')` guarantees the documented
 * `text/plain; charset=utf-8` Content-Type rather than Express's `text/html`
 * default for string responses.
 */
app.get('/hello', (req, res) => {
  res.type('text/plain').send('Hello world');
});

/**
 * GET /good-evening — the new endpoint requested by the user.
 *
 * Mirrors the /hello contract exactly: HTTP 200, `text/plain; charset=utf-8`,
 * and the verbatim plain-text body "Good evening".
 */
app.get('/good-evening', (req, res) => {
  res.type('text/plain').send('Good evening');
});

// ---------------------------------------------------------------------------
// Listener
// ---------------------------------------------------------------------------
// Bind the TCP socket and begin accepting connections. Startup performs no
// blocking work, so the server reaches the listening state well within the
// sub-second cold-start budget. The log line makes the running state visible.
app.listen(PORT, () => {
  console.log(`Artifact7 server listening on http://localhost:${PORT}`);
});
