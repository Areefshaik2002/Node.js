# Node.js & TypeScript Full Mastery Guide

A comprehensive, production-ready reference codebase and learning guide covering Node.js core modules, Express v5, TypeScript ESM configuration, Authentication (bcrypt & dual JWTs), and Role-Based Access Control (RBAC).

---

## Table of Contents
1. [Project Setup & Environment](#project-setup--environment)
2. [Chapter-by-Chapter Code & Explanations](#chapter-by-chapter-code--explanations)
   - [Chapter 1: Node.js Intro](#chapter-1-nodejs-intro)
   - [Chapter 2: File System & Streams](#chapter-2-file-system--streams)
   - [Chapter 3: NPM & Package Management](#chapter-3-npm--package-management)
   - [Chapter 4: Event Emitter](#chapter-4-event-emitter)
   - [Chapter 5: HTTP Web Server](#chapter-5-http-web-server)
   - [Chapter 6: Express.js Framework](#chapter-6-expressjs-framework)
   - [Chapter 7: Middleware Architecture](#chapter-7-middleware-architecture)
   - [Chapter 8: Express Routing](#chapter-8-express-routing)
   - [Chapter 9: MVC REST API](#chapter-9-mvc-rest-api)
   - [Chapter 10 & 11: Authentication & Dual JWT Architecture](#chapter-10--11-authentication--dual-jwt-architecture)
   - [Chapter 12: Role-Based Access Control (RBAC)](#chapter-12-role-based-access-control-rbac)
3. [Exhaustive Concept Deep-Dives](#exhaustive-concept-deep-dives)
   - [1. Node.js Architecture & Event Loop](#1-nodejs-architecture--event-loop)
   - [2. Native ESM vs CommonJS in TypeScript](#2-native-esm-vs-commonjs-in-typescript)
   - [3. Express v4 vs Express v5 Routing](#3-express-v4-vs-express-v5-routing)
   - [4. Cryptographic Hashing with Bcrypt](#4-cryptographic-hashing-with-bcrypt)
   - [5. JWT Dual-Token Lifecycle & Security](#5-jwt-dual-token-lifecycle--security)
   - [6. HttpOnly Cookies & XSS Mitigation](#6-httponly-cookies--xss-mitigation)
   - [7. Role-Based Access Control (RBAC) Implementation](#7-role-based-access-control-rbac-implementation)

---

## Project Setup & Environment

* **Language**: TypeScript (`strict: true`)
* **Module Resolution**: Native ECMAScript Modules (ESM, `"type": "module"` in `package.json`)
* **Dev Server**: `nodemon` coupled with `tsx` (`npx tsx server.ts`)
* **Framework**: Express v5

### `tsconfig.json` Setup:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src", "middleware", "controllers", "routes", "*.ts"]
}
```

---

## Chapter-by-Chapter Code & Explanations

### Chapter 1: Node.js Intro

**File**: `src/server.ts`

```typescript
import os from 'os';
import path from 'path';

console.log(`OS Type: ${os.type()}`);
console.log(`OS Version: ${os.version()}`);
console.log(`Home Dir: ${os.homedir()}`);

console.log(`Directory Name: ${path.dirname(import.meta.url)}`);
console.log(`File Name: ${path.basename(import.meta.url)}`);
console.log(`File Extension: ${path.extname(import.meta.url)}`);
```

#### **Explanation:**
- **Node.js Environment**: Runs V8 outside the browser. Standard web APIs like `window` or `document` are unavailable, replaced by globals like `process`, `global`, and core modules (`os`, `path`, `fs`).
- **ESM `import.meta.url`**: CommonJS global variables `__dirname` and `__filename` do not exist natively in ESM. Instead, `import.meta.url` provides the file's file-scheme URL.

---

### Chapter 2: File System & Streams

**Files**: `src/fileSystem.ts`, `src/dir.ts`, `src/stream.ts`

```typescript
// src/fileSystem.ts - Async/Await File Operations
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileOps = async (): Promise<void> => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, 'lorem.txt'), 'utf8');
        console.log(data);
        await fsPromises.writeFile(path.join(__dirname, 'promiseWrite.txt'), data);
        await fsPromises.appendFile(path.join(__dirname, 'promiseWrite.txt'), '\n\nNice to meet you.');
        await fsPromises.rename(path.join(__dirname, 'promiseWrite.txt'), path.join(__dirname, 'promiseComplete.txt'));
    } catch (err) {
        console.error(err);
    }
};
fileOps();
```

```typescript
// src/stream.ts - Reading Large Files via Streams
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rs = fs.createReadStream(path.join(__dirname, 'lorem.txt'), { encoding: 'utf8' });
const ws = fs.createWriteStream(path.join(__dirname, 'new-lorem.txt'));

// Pipe chunks directly from readable to writable stream
rs.pipe(ws);
```

#### **Explanation:**
- **Asynchronous non-blocking file I/O**: `fsPromises` prevents blocking the main JavaScript thread during file reads/writes.
- **Streams & Buffers**: Reading giant files completely into memory can cause out-of-memory crashes. Streams read data sequentially in smaller `Chunks` (Buffers), reducing RAM consumption. `rs.pipe(ws)` transfers data chunk-by-chunk automatically handling backpressure.

---

### Chapter 3: NPM & Package Management

**Key Tools**: `nodemon`, `date-fns`, `uuid`, `tsx`

#### **Explanation:**
- **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH` (e.g., `^4.18.2`). `^` allows compatible minor updates, `~` allows patch updates.
- **`tsx` vs `ts-node`**: `tsx` uses Esbuild under the hood to transpile TypeScript files on-the-fly instantly without requiring manual compilation steps (`tsc`) during local development.

---

### Chapter 4: Event Emitter

**Files**: `middleware/logEvents.ts`, `index.ts`

```typescript
// middleware/logEvents.ts
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (message: string, logName: string): Promise<void> => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.error(err);
    }
};
```

```typescript
// index.ts
import EventEmitter from 'node:events';
import { logEvents } from './middleware/logEvents.js';

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('log', (msg: string) => logEvents(msg, 'eventLog.txt'));
myEmitter.emit('log', 'Log event emitted!');
```

#### **Explanation:**
- **Observer Pattern**: Node.js core is event-driven. The `EventEmitter` class allows components to listen for (`.on()`) and emit (`.emit()`) named events asynchronously, decoupling log triggers from log formatting logic.

---

### Chapter 5: HTTP Web Server

**File**: `server.ts` (Native HTTP implementation reference)

```typescript
import http from 'node:http';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

const PORT = process.env.PORT || 3500;

const server = http.createServer(async (req, res) => {
    let filePath = path.join(__dirname, 'views', req.url === '/' ? 'index.html' : req.url!);
    
    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

#### **Explanation:**
- **Low-level HTTP module**: Shows how raw requests are parsed and responded to manually before using full-fledged web frameworks like Express.

---

### Chapter 6: Express.js Framework

```typescript
import express, { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/old-page', (req: Request, res: Response) => {
    res.redirect(301, '/new-page');
});
```

#### **Explanation:**
- **Express Abstractions**: Simplifies boilerplate request parsing, status codes, content-type headers, file streaming (`res.sendFile()`), and HTTP redirects (`res.redirect()`).

---

### Chapter 7: Middleware Architecture

**File**: `middleware/logger.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { logEvents } from './logEvents.js';

export const logger = (req: Request, res: Response, next: NextFunction): void => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} ${req.path}`);
    next(); // Must call next() to pass execution to subsequent middleware/routes!
};
```

#### **Explanation:**
- **Middleware Chain**: Express requests move through a pipeline of functions: `(req, res, next) => void`.
- Types of Middleware:
  1. **Built-in**: `express.json()`, `express.urlencoded()`, `express.static()`.
  2. **Custom**: User-defined handlers (e.g. `logger`).
  3. **Third-party**: Packages like `morgan`, `cors`, `cookie-parser`.

---

### Chapter 8: Express Routing

**Files**: `routes/root.ts`, `routes/subdir.ts`

```typescript
// routes/root.ts
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export default router;
```

#### **Explanation:**
- **`express.Router()`**: Modularizes routes into dedicated sub-routers instead of cluttering a single `server.ts` file.

---

### Chapter 9: MVC REST API

**Files**: `controllers/employeesController.ts`, `routes/api/employees.ts`

```typescript
// controllers/employeesController.ts
import { Request, Response } from 'express';

interface Employee {
    id: number;
    firstname: string;
    lastname: string;
}

import data from '../data/employees.json' with { type: 'json' };
let employees: Employee[] = data;

export const getAllEmployees = (req: Request, res: Response): void => {
    res.json(employees);
};

export const createNewEmployee = (req: Request, res: Response): void => {
    const newEmployee: Employee = {
        id: employees.length ? employees[employees.length - 1].id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
};
```

#### **Explanation:**
- **Model-View-Controller (MVC)**: Separation of concerns. Router defines endpoint maps, Controller houses business/validation logic, and Model represents application state (`employees.json`).

---

### Chapter 10 & 11: Authentication & Dual JWT Architecture

**Files**: `controllers/registerController.ts`, `controllers/authenticationController.ts`, `controllers/refreshTokenController.ts`, `controllers/logoutController.ts`, `middleware/verifyJWT.ts`

```typescript
// controllers/authenticationController.ts (Login & Token Issuance)
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Required fields missing.' });

    const foundUser = usersDB.users.find(u => u.username === username);
    if (!foundUser) return res.sendStatus(401);

    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        
        // 1. Issue short-lived Access Token
        const accessToken = jwt.sign(
            { "UserInfo": { "username": foundUser.username, "roles": roles } },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '30s' }
        );

        // 2. Issue long-lived Refresh Token
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '1d' }
        );

        // 3. Save Refresh Token in DB & issue HttpOnly Cookie
        foundUser.refreshToken = refreshToken;
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 86400000 });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};
```

```typescript
// middleware/verifyJWT.ts (Route Guard)
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    user?: string;
    roles?: number[];
}

export const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
        if (err) return res.sendStatus(403);
        const payload = decoded as { UserInfo: { username: string; roles: number[] } };
        req.user = payload.UserInfo.username;
        req.roles = payload.UserInfo.roles;
        next();
    });
};
```

---

### Chapter 12: Role-Based Access Control (RBAC)

**Files**: `config/roles_list.ts`, `middleware/verifyRoles.ts`

```typescript
// config/roles_list.ts
export const ROLES_LIST = {
    Admin: 5150,
    Editor: 1984,
    User: 2001
} as const;
```

```typescript
// middleware/verifyRoles.ts
import { Response, NextFunction } from 'express';
import { CustomRequest } from './verifyJWT.js';

export const verifyRoles = (...allowedRoles: number[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const hasPermission = req.roles.some(role => rolesArray.includes(role));
        if (!hasPermission) return res.sendStatus(401);
        next();
    };
};
```

---

## Exhaustive Concept Deep-Dives

### 1. Node.js Architecture & Event Loop
Node.js is a single-threaded runtime built on the V8 engine and `libuv`.
- **Call Stack**: Executes synchronous JavaScript instructions line by line.
- **Node APIs / Thread Pool (libuv)**: Handles asynchronous operations (I/O, network requests, timer execution, crypto tasks) off the main thread.
- **Event Loop Phases**:
  1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
  2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
  3. **Idle, Prepare**: Internal use only.
  4. **Poll**: Retrieves new I/O events; executes I/O related callbacks.
  5. **Check**: Executes `setImmediate()` callbacks.
  6. **Close Callbacks**: Executes close handlers (e.g. `socket.on('close')`).

### 2. Native ESM vs CommonJS in TypeScript
When `"type": "module"` is configured:
- **Imports**: Every relative module import MUST include explicit file extensions (`.js`) even when writing `.ts` files, because ESM specs require valid URI module specifiers.
- **Absence of Node Globals**: Globals `__dirname`, `__filename`, `require`, and `module.exports` do not exist in ESM context.
- **Workaround**:
  ```typescript
  import { fileURLToPath } from 'node:url';
  import path from 'node:path';
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  ```

### 3. Express v4 vs Express v5 Routing
Express v5 updated path matching:
- **No Regex Paths in Route Strings**: Wildcard syntax matching has changed. Catch-all routes must use `*splat` or explicit parameters instead of legacy regular expression strings like `(.html)?` or bare `*`.

### 4. Cryptographic Hashing with Bcrypt
- **Plain-text Security Hazard**: Storing raw passwords makes a database breach fatal for user security.
- **Salting**: Bcrypt appends a random 16-byte salt to every password before hashing, ensuring that two users with identical passwords (`password123`) produce completely different hash strings.
- **Cost Factor / Salt Rounds**: `bcrypt.hash(password, 10)` uses 10 salt rounds ($2^{10} = 1024$ key expansion iterations), deliberately slowing down hardware-accelerated brute-force attacks.

### 5. JWT Dual-Token Lifecycle & Security
A JSON Web Token consists of three base64url-encoded parts: `Header.Payload.Signature`.

```text
[Header: Algo & Type] . [Payload: User Claims] . [Signature: HMACSHA256(Header+Payload, Secret)]
```

#### **The Access & Refresh Token Workflow**:
1. User authenticates via `POST /auth`.
2. Server returns:
   - **Access Token**: Short lifespan (e.g. 15 minutes). Sent in memory to client. Attached to protected requests in header (`Authorization: Bearer <token>`).
   - **Refresh Token**: Long lifespan (e.g. 7 days). Stored in an HttpOnly cookie and persisted in database.
3. When Access Token expires (HTTP `403`), client sends GET request to `/refresh`.
4. Server validates Refresh Token cookie, verifies it against the DB, and issues a fresh Access Token.
5. Upon `/logout`, the Refresh Token is deleted from the DB and the cookie is cleared.

### 6. HttpOnly Cookies & XSS Mitigation
- **Cross-Site Scripting (XSS)**: If a hacker injects malicious JavaScript into a frontend application, they can read `localStorage` or `sessionStorage` and steal auth tokens.
- **HttpOnly Flag**: Setting `httpOnly: true` on cookies instructs client browsers that JavaScript CANNOT access or read `document.cookie`.
- **SameSite & Secure**: `sameSite: 'none'` paired with `secure: true` guarantees cross-origin cookie delivery over HTTPS while guarding against CSRF attacks.

### 7. Role-Based Access Control (RBAC) Implementation
- Numerical role mappings (`User: 2001`, `Editor: 1984`, `Admin: 5150`) obfuscate permission names in raw token payloads.
- Role checks execute via higher-order functions:
  ```typescript
  app.use('/employees', verifyJWT);
  router.delete('/', verifyRoles(ROLES_LIST.Admin), deleteEmployee);
  ```
- **Execution Flow**: `verifyJWT` decodes `req.roles` -> `verifyRoles` checks if `req.roles` intersects with allowed roles -> calls `next()` or returns `401 Unauthorized`.
