# Agent Directives - Integration Credentials

## Overview

This document defines how agents should interact with the centralized credential storage system located at `C:\Users\heath\Desktop\intergration\`.

---

## ⚠️ CRITICAL: Browser Access Prohibition (ALL AGENTS)

**ABSOLUTE PROHIBITION: Agents MUST NOT access or control the user's browser**

**FORBIDDEN tools and methods:**
- ❌ Playwright (automated browser testing)
- ❌ Puppeteer (headless Chrome automation)
- ❌ Selenium (browser automation)
- ❌ Cypress (E2E testing with browser control)
- ❌ Any automated browser control or screenshot tools
- ❌ Any script that launches or controls browser instances

**Why this is prohibited:**
- Browser automation causes system errors
- Closes user's current work and browser sessions
- Disrupts active development environment
- Can crash the IDE or operating system
- Results in lost work and frustration

**What to do instead:**
- ✅ Manual testing instructions for the user
- ✅ Static code analysis and review
- ✅ Unit tests (Jest, Vitest) without browser dependency
- ✅ Component tests (React Testing Library) in isolation
- ✅ API/integration tests (backend only)
- ✅ Request user to perform manual browser tests

**Verification before testing:**
Before running ANY test command, verify it does NOT:
1. Launch a browser instance
2. Control browser behavior programmatically
3. Take automated screenshots via browser
4. Require browser driver installation (ChromeDriver, geckodriver, etc.)

**If browser testing is absolutely required:**
- Ask the user explicitly for permission
- Explain what will happen to their browser
- Provide manual testing steps as alternative
- Never proceed without explicit user consent

---

## Credential Storage Location

**Primary Path**: `C:\Users\heath\Desktop\intergration\`

This folder contains all API keys, tokens, authentication credentials, and service configurations organized by service name.

## File Structure

Each service has its own markdown file containing:
- Service name and purpose
- All relevant credentials (keys, tokens, passwords)
- API endpoints and URLs
- Authentication methods
- Usage notes and security warnings

### Available Credential Files

| File | Service | Status |
|------|---------|--------|
| `context7.md` | Context7 API | Active |
| `elevenlabs.md` | ElevenLabs Voice AI | Active |
| `firecrawl.md` | Firecrawl Scraping | Active |
| `gemini.md` | Google Gemini AI | Placeholder |
| `github.md` | GitHub API | Active |
| `gmail.md` | Gmail SMTP | Active |
| `mcp-servers.md` | MCP Server Configs | Disabled |
| `notion.md` | Notion API | Active |
| `openai.md` | OpenAI API | Placeholder |
| `supabase.md` | Supabase (3 projects) | Active |
| `vercel.md` | Vercel Deployment | Active |

## Agent Instructions

### When Starting a New Project

1. **Check the integration folder** for relevant credentials before asking the user for API keys
2. **Read the appropriate .md file** for the service you need to integrate
3. **Use existing credentials** when available instead of creating new ones
4. **Update the corresponding .md file** if you add new credentials or discover existing ones in project files

### When Discovering New Credentials

If you find credentials in project files (.env, .env.local, config files, etc.):

1. **Read the corresponding service .md file** in the integration folder
2. **Update the file** with the new credential information
3. **Add a source note** indicating where the credential was found
4. **Update the SOURCES.md** file with the discovery location

### When Using Credentials

1. **Never commit credentials** to version control
2. **Always add to .gitignore**:
   ```
   /intergration/
   *.env
   *.env.local
   .env.*
   ```
3. **Use environment variables** in projects, referencing the integration folder for the actual values
4. **Document which credentials are used** in project README files

### Credential Priority

1. **First**: Check `C:\Users\heath\Desktop\intergration\` for existing credentials
2. **Second**: Search project files for .env and config files
3. **Third**: Ask the user for new credentials only if not found above

## Common Integration Patterns

### Supabase
- Check `supabase.md` for all project configurations
- Note: Multiple projects exist - use the correct one for each application
- Never use service_role keys on client-side

### GitHub
- Use the personal access token from `github.md`
- Consider migrating to fine-grained tokens for better security

### API Services (Context7, Firecrawl, ElevenLabs)
- Keys are stored directly in their respective .md files
- These are external service APIs - no additional configuration needed

### MCP Servers
- Configuration stored in `mcp-servers.md`
- Currently disabled by default
- Enable by changing `"disabled": false` in configs

### Email (Gmail)
- App password stored in `gmail.md`
- Use for SMTP configurations only

### AI Services (OpenAI, Gemini)
- Currently placeholders - need actual API keys
- Update these files when keys are obtained

## Security Reminders

⚠️ **CRITICAL**: Never expose these credentials in:
- Commit messages
- Public repositories
- Screenshots or shared images
- Logs or console output
- Documentation accessible to others

## Search Locations for New Credentials

When looking for credentials, check these locations:

### Primary Locations
- `C:\Users\heath\Desktop\intergration\` (centralized storage)
- `C:\Users\heath\Desktop\Project_Directory\` (project directories)
- `C:\Users\heath\Desktop\connect\` (credential backups)

### File Patterns to Search
- `.env` files
- `.env.local` files
- `config.json` files
- `auth.txt` or similar credential files
- Application configuration directories

### GitHub
- Check repository secrets (if accessible)
- Look for GitHub Actions workflow files with encrypted variables
- Check for any committed credential files (and remind user to remove them)

## Maintenance Tasks

### Regular Updates
- [ ] Review and rotate tokens quarterly
- [ ] Check for expired credentials
- [ ] Update placeholder files with actual values
- [ ] Remove unused service credentials

### When Adding New Services
1. Create a new `[service-name].md` file in the integration folder
2. Follow the template format from existing files
3. Update this AGENTS.md file to include the new service
4. Update README.md in the integration folder

## Emergency Contacts

If credentials are exposed:
1. Immediately rotate the compromised token/key
2. Update the corresponding .md file
3. Check all projects using that credential
4. Review access logs for unauthorized usage

---

**Last Updated**: 2025-01-30
**Maintained by**: Agents working on heath's projects
**Location**: Keep this file in your project root or in the skillskit folder for easy access
