# Integration Expert Skill

## Purpose
Master service integration, API connectivity, MCP configuration, and authentication setup. Enable seamless connections between external services and agents/IDEs.

## When to Use This Skill
- Setting up new service integrations
- Troubleshooting connection failures
- Configuring authentication flows
- Installing and configuring MCP servers
- Connecting databases, APIs, hosting platforms
- Resolving IDE integration issues

## Integration Categories

### 1. MCP (Model Context Protocol) Integration

#### Installing MCP Servers

**Standard Installation**:
```bash
# Filesystem MCP
npm install -g @modelcontextprotocol/server-filesystem

# GitHub MCP
npm install -g @modelcontextprotocol/server-github

# PostgreSQL MCP
npm install -g @modelcontextprotocol/server-postgres

# SQLite MCP
npm install -g @modelcontextprotocol/server-sqlite
```

**Configuration (VS Code/Cursor)**:
```json
// settings.json or claude_desktop_config.json
{
  "mcp": {
    "inputs": [],
    "servers": {
      "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:/Users/heath/Desktop"],
        "env": {},
        "disabled": false,
        "autoApprove": []
      },
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
        }
      }
    }
  }
}
```

**Troubleshooting MCP Issues**:

**Problem**: "Could not connect to MCP server"
```bash
# Check 1: Test command manually
npx -y @modelcontextprotocol/server-filesystem /test/path

# Check 2: Verify Node.js version
node --version  # Need 18+

# Check 3: Check for permission issues (Windows)
# Run VS Code as Administrator if needed

# Check 4: Verify paths are correct
# Use forward slashes even on Windows in JSON
```

**Problem**: MCP shows "Disconnected" in UI
```bash
# Solution 1: Restart IDE completely
# Solution 2: Check Output panel → MCP logs
# Solution 3: Remove and re-add server config
# Solution 4: Update MCP package
npm update -g @modelcontextprotocol/server-[name]
```

#### Popular MCP Servers

| Server | Use Case | Install Command |
|--------|----------|-----------------|
| @modelcontextprotocol/server-filesystem | File operations | `npx -y @modelcontextprotocol/server-filesystem /path` |
| @modelcontextprotocol/server-github | GitHub API access | `npx -y @modelcontextprotocol/server-github` |
| @modelcontextprotocol/server-postgres | PostgreSQL queries | `npx -y @modelcontextprotocol/server-postgres` |
| @modelcontextprotocol/server-sqlite | SQLite operations | `npx -y @modelcontextprotocol/server-sqlite` |
| @modelcontextprotocol/server-puppeteer | Browser automation | `npx -y @modelcontextprotocol/server-puppeteer` |
| @anthropic-ai/mcp-server-fetch | HTTP requests | `npx -y @anthropic-ai/mcp-server-fetch` |

### 2. Database Integration

#### Supabase Setup

**Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key  # Server-side only
```

**Client Setup**:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For server-side operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

**Connection Troubleshooting**:
```bash
# Test connection
curl -H "apikey: $ANON_KEY" \
     $SUPABASE_URL/rest/v1/tablename?select=*

# Check if database is up
supabase status

# Common issues:
# 1. Wrong URL (should end with .supabase.co)
# 2. Using anon key for admin operations
# 3. RLS policies blocking access
# 4. Network/firewall blocking port 5432
```

#### PostgreSQL Direct Connection

**Connection String**:
```env
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

**Prisma Setup**:
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Troubleshooting**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check SSL requirements
# Verify credentials
# Check IP allowlist
```

### 3. Authentication Integration

#### API Key Authentication

**Setup**:
```env
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...
```

**Security Best Practices**:
- Never commit .env files
- Use different keys for dev/staging/prod
- Rotate keys regularly
- Limit key permissions (principle of least privilege)
- Monitor API usage for anomalies

#### OAuth 2.0 Setup

**NextAuth.js Configuration**:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }
```

**Environment**:
```env
GITHUB_ID=your-oauth-app-id
GITHUB_SECRET=your-oauth-app-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random-secret-key
```

**OAuth Troubleshooting**:
- Verify callback URL matches exactly
- Check if OAuth app is published (not in development mode)
- Verify required scopes are granted
- Check for redirect URI mismatches

#### JWT Authentication

**Setup**:
```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET)
}
```

### 4. API Integration Patterns

#### REST API Integration

**Standard Pattern**:
```typescript
// lib/api/client.ts
class ApiClient {
  private baseUrl: string
  private apiKey: string

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
```

**Error Handling**:
```typescript
try {
  const data = await apiClient.request('/users')
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes('401')) {
      // Authentication error - refresh token
    } else if (error.message.includes('429')) {
      // Rate limit - implement backoff
    }
  }
}
```

#### GraphQL Integration

**Setup with Apollo**:
```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

### 5. Vercel Integration

**CLI Setup**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables
vercel env add OPENAI_API_KEY

# Deploy
vercel --prod
```

**Environment Variables**:
```bash
# Add secret
vercel env add DATABASE_URL

# Pull env for local development
vercel env pull .env.local

# List env vars
vercel env ls
```

**Troubleshooting**:
```bash
# Check deployment logs
vercel logs

# Redeploy with clean cache
vercel --force

# Check build locally first
vercel build
```

### 6. GitHub Integration

**GitHub CLI Setup**:
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Set default protocol (SSH recommended for private repos)
gh config set git_protocol ssh

# Test connection
gh repo view
```

**GitHub Actions Integration**:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 7. IDE Integration

#### VS Code Settings

**MCP Configuration**:
```json
// .vscode/settings.json (project-specific)
{
  "mcp.servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "$DATABASE_URL"]
    }
  }
}
```

**Environment in VS Code**:
```json
{
  "terminal.integrated.env.windows": {
    "NODE_ENV": "development"
  }
}
```

#### Cursor IDE

**MCP in Cursor**:
1. Open Cursor Settings
2. Go to "MCP" section
3. Add server configuration
4. Restart Cursor

### 8. Third-Party Service Integration

#### Stripe (Payments)

**Setup**:
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Webhook Configuration**:
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Update database
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
}
```

#### Slack Integration

**Webhook Setup**:
```typescript
// lib/slack.ts
export async function sendSlackMessage(message: string) {
  const response = await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  })

  if (!response.ok) {
    throw new Error('Failed to send Slack message')
  }
}
```

## Integration Testing

### Health Check Pattern
```typescript
// lib/health-check.ts
export async function checkIntegrationHealth() {
  const checks = {
    database: await checkDatabase(),
    api: await checkApiConnection(),
    auth: await checkAuth(),
    mcp: await checkMcpServers(),
  }

  const healthy = Object.values(checks).every(c => c.status === 'ok')
  
  return {
    healthy,
    checks,
    timestamp: new Date().toISOString(),
  }
}

async function checkDatabase() {
  try {
    // Test query
    return { status: 'ok', latency: 50 }
  } catch (error) {
    return { status: 'error', message: error.message }
  }
}
```

### Automated Testing
```bash
# Test all integrations
npm run test:integrations

# Test specific service
npm run test:db
npm run test:api
```

## Troubleshooting Decision Tree

```
Connection Issue
├── Is it authentication?
│   ├── Check API key/token
│   ├── Verify permissions/scopes
│   └── Regenerate if expired
├── Is it network?
│   ├── Test with curl/Postman
│   ├── Check firewall/VPN
│   └── Verify DNS resolution
├── Is it the service?
│   ├── Check status page
│   ├── Try alternative endpoint
│   └── Review rate limits
└── Is it configuration?
    ├── Verify environment variables
    ├── Check file paths (MCP)
    └── Restart IDE/server
```

## Security Checklist

- [ ] API keys stored in environment variables (not code)
- [ ] .env files in .gitignore
- [ ] Different credentials for dev/staging/prod
- [ ] Rate limiting configured
- [ ] HTTPS only (no HTTP)
- [ ] Authentication tokens rotated regularly
- [ ] IP allowlisting configured (if applicable)
- [ ] Webhook signatures verified
- [ ] Secrets not logged to console
- [ ] Error messages don't expose sensitive data

## Common Integration Issues

### Issue: "self-signed certificate" error
**Solution**:
```bash
# Development only - don't use in production
NODE_TLS_REJECT_UNAUTHORIZED=0

# Or properly configure SSL certificates
```

### Issue: CORS errors in browser
**Solution**:
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}
```

### Issue: "ECONNREFUSED" on local development
**Solution**:
```bash
# Check if service is running
# Verify port numbers
# Check docker-compose if using containers
docker-compose ps
```

## See Also
- `agents/integration-expert.md` - Agent definition
- `skills/vercel-cli/SKILL.md` - Vercel-specific details
- `skills/mcp-builder/SKILL.md` - Creating custom MCPs
- `knowledge-base/LEARNED_SOLUTIONS.md` - Integration solutions
