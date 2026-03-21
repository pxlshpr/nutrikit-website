Publish the NutriKit website to Vercel (production).

## Instructions

1. **Confirm with the user** before proceeding — this pushes to the public site:
   ```
   This will publish the current state to Vercel (production). Proceed?
   ```

2. **Build and verify locally** first:
   ```bash
   cd /Users/pxlshpr/Developer/nutrikit-website && npm run build
   ```

3. **Deploy to Vercel production**:
   ```bash
   cd /Users/pxlshpr/Developer/nutrikit-website && vercel --prod
   ```

4. **Report the result** — show the production URL from Vercel's output.

## Important
- ALWAYS ask for confirmation before deploying — this is the public site
- If the build fails, stop and fix the issue before deploying
- Use `vercel --prod` for production deployments (not preview)
