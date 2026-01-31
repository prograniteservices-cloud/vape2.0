# Auto-Fix Agent Skill

## Purpose
Enable automatic error detection and resolution by applying documented solutions from the knowledge base. Reduce manual intervention for known issues.

## When to Use This Skill
- Build errors that occur repeatedly
- TypeScript errors with known patterns
- Runtime errors previously solved
- Deployment failures with documented fixes
- Any error where the solution exists in LEARNED_SOLUTIONS.md

## How It Works

### 1. Error Detection
The agent continuously monitors:
- Build output (npm run build)
- Type checking (tsc --noEmit)
- Test results (npm test)
- Runtime console errors
- Deployment logs

### 2. Pattern Matching
When an error occurs:
```
1. Extract error signature (unique identifier)
2. Search LEARNED_SOLUTIONS.md
3. Match by:
   - Exact error message
   - Error tags (#build-error, #typescript)
   - Similar patterns (fuzzy matching)
4. Rank matches by confidence
```

### 3. Solution Application
If match found (confidence >80%):
```
1. Parse solution steps from KB
2. Execute each step automatically
3. Verify fix worked
4. Log success
```

If no match found:
```
1. Log novel error
2. Escalate to human
3. Wait for human solution
4. Learn solution for next time
```

### 4. Verification
After applying fix:
- Re-run command that failed
- Check no new errors introduced
- Verify fix persists

## Error Signature Format

Add error signatures to KB entries for matching:

```markdown
### 2026-01-30 - Example Error
**Error Signature**: "Module not found: Can't resolve 'X'"
**Context**: Build failure
**Problem**: Dependency X not installed
**Solution**: npm install X --save
**Tags**: #build-error #npm #dependency
```

**Good Signatures**:
- Exact error message: "TS2345: Argument of type 'string'..."
- Unique identifier: "Module not found: Can't resolve '@radix-ui/react-select'"
- Pattern with wildcards: "ENOENT: no such file or directory, open '*'.config.js"

## Auto-Fix Categories

### ✅ Safe to Auto-Fix
- Missing dependencies (npm install)
- Import statement fixes
- Type annotation corrections
- Configuration updates
- Lint fixes (auto-fixable)
- Formatting issues

### ⚠️ Ask First
- File deletions
- Major refactors
- Git operations
- Environment variable changes

### ❌ Never Auto-Fix
- Authentication changes
- Security-related fixes
- Database migrations
- Production deployments
- Destructive operations

## Implementation

### Basic Error Monitoring

```bash
#!/bin/bash
# auto-fix-monitor.sh

# Run build and capture output
npm run build 2>&1 | tee /tmp/build.log
BUILD_STATUS=$?

# If build failed, trigger auto-fix
if [ $BUILD_STATUS -ne 0 ]; then
  echo "Build failed. Attempting auto-fix..."
  auto-fix-agent --error-log /tmp/build.log
fi
```

### Integration with Package Scripts

```json
{
  "scripts": {
    "build": "next build",
    "build:auto-fix": "npm run build || auto-fix-agent --retry",
    "dev": "next dev",
    "dev:watch": "npm run dev & auto-fix-agent --watch"
  }
}
```

### TypeScript Error Handler

```typescript
// lib/auto-fix/handler.ts
export class AutoFixHandler {
  async handleTypeScriptError(error: string) {
    // Search KB
    const solution = await this.searchKB(error);
    
    if (solution) {
      // Apply fix
      await this.applySolution(solution);
      
      // Verify
      const verified = await this.verifyFix();
      
      if (verified) {
        console.log('✅ Auto-fix successful');
        return { fixed: true, solution };
      }
    }
    
    // No solution found
    return { fixed: false, error: 'No KB match' };
  }
  
  private async searchKB(error: string) {
    // Read LEARNED_SOLUTIONS.md
    // Match error signatures
    // Return best match
  }
  
  private async applySolution(solution: Solution) {
    // Execute solution steps
    for (const step of solution.steps) {
      await execute(step);
    }
  }
  
  private async verifyFix() {
    // Re-run type check
    const result = await exec('npx tsc --noEmit');
    return result.code === 0;
  }
}
```

## Common Auto-Fix Patterns

### Pattern 1: Missing Dependency

**Error**: `Module not found: Can't resolve 'X'`

**KB Entry**:
```markdown
### 2026-01-30 - Missing Dependency Error
**Error Signature**: "Module not found: Can't resolve '*"""
**Problem**: Package not installed
**Solution**:
1. Extract package name from error
2. Run: npm install [package] --save
3. Verify package.json updated
**Tags**: #build-error #npm #dependency
```

**Auto-Fix Logic**:
```javascript
const packageName = extractPackageName(error);
await exec(`npm install ${packageName} --save`);
```

### Pattern 2: TypeScript Type Error

**Error**: `TS2345: Argument of type 'X' is not assignable to type 'Y'`

**KB Entry**:
```markdown
### 2026-01-30 - Framer Motion Type Error
**Error Signature**: "TS2345: Argument of type 'string[]' is not assignable to parameter of type 'BezierDefinition'"
**Problem**: Framer-motion ease property type mismatch
**Solution**:
1. Change ease array to "easeOut" string
2. Or use: ease: [0.42, 0, 0.58, 1] as const
**Tags**: #typescript #framer-motion #animation
```

**Auto-Fix Logic**:
```javascript
// Detect file and line from error
const { file, line } = parseErrorLocation(error);

// Read file
const content = await readFile(file);

// Apply fix based on pattern
const fixed = content.replace(
  /ease:\s*\[[\d,\s]+\]/g,
  'ease: "easeOut"'
);

// Write back
await writeFile(file, fixed);
```

### Pattern 3: Import Path Error

**Error**: `Cannot find module '@/components/X'`

**KB Entry**:
```markdown
### 2026-01-30 - Path Alias Error
**Error Signature**: "Cannot find module '@/components/*"""
**Problem**: Path alias not resolving
**Solution**:
1. Check tsconfig.json paths
2. Verify file exists at alias target
3. Update import to relative path if needed
**Tags**: #typescript #imports #configuration
```

## Learning from Novel Errors

When encountering a new error:

1. **Log the error**:
```markdown
### 2026-01-30 - NOVEL: [Error Description]
**Error Signature**: "[exact error message]"
**Context**: [what was happening]
**Status**: 🔴 AWAITING SOLUTION
```

2. **After human fixes, document**:
```markdown
### 2026-01-30 - [Error Description]
**Error Signature**: "[exact error message]"
**Context**: [what was happening]
**Problem**: [root cause]
**Solution**:
1. [step 1]
2. [step 2]
3. [step 3]
**Verification**: [how to verify fix]
**Tags**: #[relevant tags]
**Status**: ✅ AUTO-FIX ENABLED
```

## Auto-Fix Best Practices

### 1. Always Verify
Never assume fix worked. Always verify:
```bash
# Re-run the failing command
npm run build

# Run tests
npm test

# Check for new errors
```

### 2. Three-Strike Rule
If fix fails 3 times, stop and escalate:
```
Attempt 1: Failed, trying alternative...
Attempt 2: Failed, trying last resort...
Attempt 3: Failed, escalating to human.
```

### 3. Document Everything
Every auto-fix should log:
- Error signature
- Solution applied
- Success/failure
- Time taken
- Verification result

### 4. Gradual Rollout
Start with safe fixes only:
```
Phase 1: Missing dependencies only
Phase 2: Add TypeScript fixes
Phase 3: Add configuration fixes
Phase 4: Add code pattern fixes
```

### 5. Monitor Effectiveness
Track metrics:
- Auto-fix success rate
- Time saved
- Novel error rate
- Escalation rate

## Integration with Development Workflow

### IDE Integration
```json
// .vscode/settings.json
{
  "autoFix.enabled": true,
  "autoFix.autoApply": ["dependency", "import"],
  "autoFix.askFirst": ["refactor", "delete"],
  "autoFix.neverApply": ["auth", "security"]
}
```

### Git Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run auto-fix on staged files
auto-fix-agent --staged

# If fixes were applied, re-stage
if [ -f .auto-fix-changes ]; then
  git add -A
fi
```

### CI/CD Integration
```yaml
# .github/workflows/build.yml
jobs:
  build:
    steps:
      - name: Build
        run: npm run build
        
      - name: Auto-Fix (if failed)
        if: failure()
        run: auto-fix-agent --retry
        
      - name: Build Again
        if: failure()
        run: npm run build
```

## Troubleshooting Auto-Fix Issues

### Issue: False Positives
**Problem**: Auto-fix applies wrong solution

**Solution**:
- Improve error signatures
- Add more context matching
- Increase confidence threshold
- Require exact matches for critical fixes

### Issue: Fix Verification Fails
**Problem**: Fix appears to work but breaks something else

**Solution**:
- Run full test suite after fix
- Check for side effects
- Implement rollback capability
- Add integration tests

### Issue: Novel Errors Not Detected
**Problem**: Similar errors treated as different

**Solution**:
- Use fuzzy matching
- Normalize error messages
- Group by error type
- Update signatures regularly

## Metrics & Reporting

### Weekly Auto-Fix Report
```
AUTO-FIX REPORT - Week of 2026-01-30
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ERRORS DETECTED:
- Total: 47
- Build errors: 23
- Type errors: 15
- Runtime errors: 9

AUTO-FIXES:
- Attempted: 42 (89% of errors)
- Successful: 38 (90% of attempts)
- Failed: 4 (10% of attempts)

TIME SAVED:
- Manual fix time: 15 min avg
- Auto-fix time: 2 min avg
- Total saved: 8.2 hours

KNOWLEDGE BASE:
- Entries: 127
- With signatures: 89 (70%)
- Auto-fixable: 81 (64%)

TOP FIXED ERRORS:
1. Missing dependency (12x)
2. Type annotation (8x)
3. Import path (7x)

NOVEL ERRORS:
- Detected: 5
- Documented: 5
- Now auto-fixable: 5

RECOMMENDATIONS:
- Add signatures to remaining 38 KB entries
- Increase TypeScript pattern coverage
- Consider auto-fix for lint errors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Advanced Features

### Predictive Auto-Fix
Fix errors before they happen:
```
Analyzing code patterns...
⚠️ Detected potential issue: Missing null check
🔮 Applying preventive fix...
✅ Issue prevented
```

### Batch Auto-Fix
Fix multiple similar errors at once:
```
Detected 5 similar TypeScript errors
Applying batch fix...
✓ Fixed 5/5 errors
```

### Smart Retry
Try different solutions if first fails:
```
Solution A failed, trying Solution B...
Solution B failed, trying Solution C...
✓ Solution C worked!
```

## See Also
- `agents/auto-fix-agent.md` - Agent definition
- `analytics/self-healer.md` - Detection system
- `knowledge-base/LEARNED_SOLUTIONS.md` - Solution database
