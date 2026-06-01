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
 *   - Exact paths:    Routing is configured case-sensitive and strict
 *                     (trailing-slash-significant), so ONLY the exact paths
 *                     "/hello" and "/good-evening" match. Variants such as
 *                     "/HELLO" or "/hello/" do not match and fall through to
 *                     Express's built-in default 404.
 *   - GET only:       Only the HTTP GET method is served. A guard rejects every
 *                     non-GET request — including HEAD and OPTIONS, which Express
 *                     would otherwise auto-handle for GET routes — with HTTP 404,
 *                     honoring the "no non-GET methods" API contract.
 *   - 404 behavior:   Unmatched GET paths fall through to Express's built-in
 *                     default 404 handler; non-GET methods are answered with a
 *                     plain-text 404 by the method guard. No other custom error
 *                     handling is required.
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

// ---------------------------------------------------------------------------
// Routing strictness — enforce EXACT-path matching
// ---------------------------------------------------------------------------
// By default Express matches routes case-insensitively and ignores a trailing
// slash, so "/HELLO" and "/hello/" would both reach the "/hello" handler. The
// API contract requires that ONLY the exact paths "/hello" and "/good-evening"
// match (every other path must return 404), so enable case-sensitive and strict
// routing. These settings are applied BEFORE any route or middleware is
// registered so the router captures them when each route layer is built.
app.set('case sensitive routing', true);
app.set('strict routing', true);

// Listening port. Defaults to the conventional development port 3000 and honors
// an optional `PORT` environment-variable override for flexible local runs.
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Method policy — serve GET only
// ---------------------------------------------------------------------------
// The API contract permits the GET method only; there are no non-GET methods.
// Express, however, auto-derives HEAD from a GET handler and auto-answers
// OPTIONS with an `Allow` header, which would expose undocumented 200 responses
// on the greeting routes. This guard runs before routing and short-circuits any
// non-GET request (HEAD, OPTIONS, POST, PUT, DELETE, ...) with a plain-text
// HTTP 404, so only GET requests ever reach the route handlers below. Unmatched
// GET paths still fall through to Express's built-in default 404.
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    res.status(404).type('text/plain').send('Not Found');
    return;
  }
  next();
});

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
