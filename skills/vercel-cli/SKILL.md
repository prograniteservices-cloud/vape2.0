# Vercel CLI Skill

## Description
Deploy and manage projects on Vercel's edge network using the command line interface.

## When to Use
- Deploying Next.js, React, or other frontend applications
- Managing production and preview deployments
- Configuring environment variables
- Setting up custom domains
- Managing team projects

## Prerequisites
- Vercel CLI installed: `npm i -g vercel`
- Vercel account (create at vercel.com)
- Project ready for deployment

## Common Commands

### Authentication & Setup
```bash
# Login to Vercel
vercel login

# Link current directory to a Vercel project
vercel link

# Switch team/account
vercel switch
```

### Deployment
```bash
# Deploy current directory (creates preview deployment)
vercel

# Deploy to production
vercel --prod

# Deploy specific directory
vercel ./dist

# Deploy with specific name
vercel --name my-project
```

### Environment Variables
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# Add environment variable for specific environment
vercel env add VARIABLE_NAME production

# List all environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

### Project Management
```bash
# List all projects
vercel projects

# Show project information
vercel project

# List deployments
vercel deployments

# Remove deployment
vercel remove deployment-url

# Inspect specific deployment
vercel inspect deployment-url
```

### Domains & Aliases
```bash
# Add custom domain
vercel domains add example.com

# List domains
vercel domains

# Verify domain
vercel domains verify example.com
```

### Advanced Usage
```bash
# Deploy with specific config
vercel --config vercel.json

# Deploy with build cache disabled
vercel --no-cache

# Force deployment even with errors
vercel --force

# Show build logs
vercel logs deployment-url

# Stream real-time logs
vercel logs deployment-url --follow
```

## Configuration File (vercel.json)

```json
{
  "version": 2,
  "name": "my-project",
  "builds": [
    { "src": "package.json", "use": "@vercel/next" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" }
  ],
  "env": {
    "CUSTOM_KEY": "@custom-value"
  },
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

## Deployment Workflow

### Standard Deployment Process
1. **Prepare project**: Ensure project builds locally (`npm run build`)
2. **Link project**: Run `vercel link` in project directory
3. **Configure env vars**: Add required environment variables
4. **Deploy preview**: Run `vercel` to create preview deployment
5. **Test preview**: Verify preview deployment works correctly
6. **Deploy production**: Run `vercel --prod` when ready

### Git Integration
- Connect GitHub/GitLab/Bitbucket repo in Vercel dashboard
- Automatic preview deployments on every push
- Production deployments on main/master branch merges
- Comments on PRs with preview URLs

## Troubleshooting

### Build Failures
```bash
# Check build logs
vercel logs [deployment-url]

# Redeploy with clean cache
vercel --force --no-cache
```

### Environment Issues
- Verify env vars are set: `vercel env ls`
- Check variable values in dashboard
- Ensure variables are set for correct environment (development/preview/production)

### Common Errors
- **"Project not found"**: Run `vercel link` first
- **"Build failed"**: Check local build with `npm run build`
- **"Unauthorized"**: Run `vercel login` to re-authenticate

## Best Practices

1. **Always test locally first**: Run `npm run build` before deploying
2. **Use preview deployments**: Test changes before production
3. **Set environment variables early**: Configure before first deployment
4. **Use vercel.json**: Define build settings in version control
5. **Enable Git integration**: Automatic deployments save time
6. **Monitor deployment logs**: Check for warnings and optimizations

## Resources
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Vercel Configuration](https://vercel.com/docs/configuration)
- [Environment Variables](https://vercel.com/docs/environment-variables)
