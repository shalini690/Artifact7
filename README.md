# Artifact7

Artifact7 is a minimal [Express.js](https://expressjs.com/) HTTP server that exposes two `GET` endpoints, each returning a short plain-text greeting (`Hello world` and `Good evening`). It is a small, local-run learning artifact.

## Prerequisites

- [Node.js](https://nodejs.org/) with npm. Node.js 24 LTS is recommended (Node.js 22 LTS is also acceptable).
- Express 5 requires Node.js 18 or newer.

## Installation

Install the single runtime dependency (`express`):

```bash
npm install
```

## Running the server

Start the server with the npm `start` script (equivalent to running `node server.js` directly):

```bash
npm start
```

The server listens on `http://localhost:3000` by default. To use a different port, set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Endpoints

Both endpoints respond with HTTP `200` and `Content-Type: text/plain`.

| Method | Path            | Response body  |
| ------ | --------------- | -------------- |
| `GET`  | `/hello`        | `Hello world`  |
| `GET`  | `/good-evening` | `Good evening` |

With the server running, call them with `curl`:

```bash
curl http://localhost:3000/hello
# -> Hello world

curl http://localhost:3000/good-evening
# -> Good evening
```

Any other path returns Express's default `404 Not Found` response.
