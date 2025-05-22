# Vercel Deployment Setup

This guide explains how to deploy CourseCentral to Vercel.

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com/) and sign in
2. Click "Add New..." → "Project"
3. Select your Github repository (you may need to import your repository first)
4. Configure the project:

   - Framework Preset: Next.js
   - Root Directory: `CourseCentral-WebApp/`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Add the environment variables:

   - Click "Environment Variables"
   - Add the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

6. Click "Deploy"

## Option 2: Deploy via Command Line

If you prefer using the command line, you can deploy with the Vercel CLI:

1. Install the Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:

   ```bash
   vercel login
   ```

3. Link your project:

   ```bash
   vercel link
   ```

4. Deploy:

   ```bash
   vercel
   ```

5. Add environment variables:
   - Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to the "Settings" tab
   - Click on "Environment Variables" in the left sidebar
   - Add each environment variable (key and value)
   - Redeploy your application after adding the variables

## Troubleshooting

If you encounter build errors:

1. Check the build logs for specific errors
2. Make sure your project has all the required dependencies
3. Ensure environment variables are correctly set
4. If TypeScript or ESLint errors are preventing deployment, you can edit `next.config.ts` to ignore them:

```typescript
// next.config.ts
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
```
