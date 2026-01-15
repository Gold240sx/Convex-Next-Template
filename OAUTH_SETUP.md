# OAuth Provider Setup Guide

This guide will help you configure GitHub, Google, and Discord OAuth authentication for your Convex application.

## Overview

Your application now supports four authentication methods:
- **Password** (Email + Password) - Already configured
- **GitHub OAuth** - Requires setup
- **Google OAuth** - Requires setup
- **Discord OAuth** - Requires setup

## Important URLs

Your Convex deployment: `https://good-mastiff-390.convex.site`

### OAuth Callback URLs
- **GitHub**: `https://good-mastiff-390.convex.site/api/auth/callback/github`
- **Google**: `https://good-mastiff-390.convex.site/api/auth/callback/google`
- **Discord**: `https://good-mastiff-390.convex.site/api/auth/callback/discord`

---

## GitHub OAuth Setup

### 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the application details:
   - **Application name**: Portfolio Convex 2026 (or your preferred name)
   - **Homepage URL**: `http://localhost:3002` (for development)
   - **Authorization callback URL**: `https://good-mastiff-390.convex.site/api/auth/callback/github`
4. Click **Register application**

### 2. Get Your Credentials

1. Copy the **Client ID** from your OAuth app page
2. Click **Generate a new client secret** and copy the secret

### 3. Set Environment Variables in Convex

Run these commands in your project directory:

```bash
npx convex env set AUTH_GITHUB_ID your-github-client-id
npx convex env set AUTH_GITHUB_SECRET your-github-client-secret
```

Replace `your-github-client-id` and `your-github-client-secret` with your actual values.

---

## Google OAuth Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** for your project

### 2. Create OAuth Credentials

1. Go to [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in required fields (app name, user support email, developer email)
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if in development mode
4. Create OAuth client ID:
   - **Application type**: Web application
   - **Name**: Portfolio Convex 2026 (or your preferred name)
   - **Authorized JavaScript origins**: 
     - `http://localhost:3002` (for development)
     - Your production domain (when deployed)
   - **Authorized redirect URIs**: 
     - `https://good-mastiff-390.convex.site/api/auth/callback/google`
5. Click **Create**

### 3. Get Your Credentials

1. Copy the **Client ID**
2. Copy the **Client Secret**

### 4. Set Environment Variables in Convex

Run these commands in your project directory:

```bash
npx convex env set AUTH_GOOGLE_ID your-google-client-id
npx convex env set AUTH_GOOGLE_SECRET your-google-client-secret
```

Replace `your-google-client-id` and `your-google-client-secret` with your actual values.

---

## Discord OAuth Setup

### 1. Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** and give it a name
3. Go to the **OAuth2** tab in the sidebar
4. Under **Redirects**, click **Add Redirect**
5. Enter your callback URL: `https://good-mastiff-390.convex.site/api/auth/callback/discord`
6. Click **Save Changes**

### 2. Get Your Credentials

1. On the **OAuth2** page, find the **Client ID**
2. Find the **Client Secret** (you may need to click **Reset Secret**)

### 3. Set Environment Variables in Convex

Run these commands in your project directory:

```bash
npx convex env set AUTH_DISCORD_ID your-discord-client-id
npx convex env set AUTH_DISCORD_SECRET your-discord-client-secret
```

Replace `your-discord-client-id` and `your-discord-client-secret` with your actual values.

---

## Verification

After setting up all providers:

1. Restart your Convex backend:
   ```bash
   # Stop the current dev server (Ctrl+C)
   pnpm dev
   ```

2. Navigate to `/signin` in your application
3. You should see all sign-in options:
   - **Continue with GitHub** button
   - **Continue with Google** button
   - **Continue with Discord** button
   - **Email/Password** form

4. Test each authentication method to ensure they work correctly

---

## Troubleshooting

### "Redirect URI mismatch" error
- Verify the callback URL in your OAuth app matches exactly: `https://good-mastiff-390.convex.site/api/auth/callback/PROVIDER`
- Make sure there are no trailing slashes
- Check that you're using `.convex.site` (not `.convex.cloud`)

### Environment variables not working
- Verify variables are set: `npx convex env list`
- Restart your Convex dev server after setting variables
- Check for typos in variable names (must be `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, etc.)

### OAuth provider not showing up
- Check that `@auth/core` package is installed (version ^0.37.0)
- Verify `convex/auth.ts` includes the provider in the providers array
- Check browser console for any errors

---

## Production Deployment

When deploying to production:

1. Update OAuth app callback URLs to use your production Convex deployment URL
2. Add your production domain to authorized origins (Google) and homepage URL (GitHub)
3. Set environment variables in your production Convex deployment
4. Consider moving from "Testing" to "Published" status in Google OAuth consent screen

---

## Additional Resources

- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
