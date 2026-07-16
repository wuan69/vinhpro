# Elite Hoops - Pro Basketball Coach Portfolio

A premium, modern portfolio website built for a professional basketball coach. Designed with a dark, sporty aesthetic and optimized for high-performance lead generation.

## Features

- **No Frameworks:** Built purely with HTML5, Tailwind CSS, and Vanilla JavaScript.
- **Modern UI:** Glassmorphism, premium typography, fluid layout, and sporty orange accents.
- **Animations:** High-performance scroll animations powered by AOS.
- **Lead Capture:** Includes floating modal and footer forms.
- **Backend:** Serverless lead submission using Netlify Functions and the Telegram Bot API.
- **Responsive:** Desktop, tablet, and mobile-ready.

## Project Structure

```
├── .netlify/
│   └── functions/
│       └── sendTelegram.js    # Serverless endpoint for lead capture
├── src/
│   ├── index.css              # Tailwind CSS entry
│   └── main.js                # Vanilla JS logic & animations
├── index.html                 # Homepage
├── about.html                 # Detailed Bio Page
├── netlify.toml               # Netlify configuration and redirects
├── package.json               # Dependencies for build (Tailwind, Vite)
├── server.ts                  # Local Express backend proxy for development
└── vite.config.ts             # Bundler configuration
```

## Local Development

If you're running this locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your Telegram environment variables locally:
   - Create a `.env` file (see `.env.example`).
   - Add `BOT_TOKEN` and `CHAT_ID`.

3. Run the development server:
   ```bash
   npm run dev
   ```

## Netlify Deployment

This project is fully configured for a seamless deployment to Netlify.

1. **Push to GitHub:** Commit this repository and push it to a new GitHub repository.
2. **Import to Netlify:**
   - Log in to your Netlify account and click **Add new site** > **Import an existing project**.
   - Connect your GitHub account and select your repository.
3. **Configure Settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Environment Variables:**
   - Go to your Netlify site settings > **Environment Variables**.
   - Add the following variables:
     - `BOT_TOKEN`: Your Telegram Bot API token (from BotFather).
     - `CHAT_ID`: The Telegram chat ID where you want to receive leads.
5. **Deploy:** Click **Deploy site**. Netlify will automatically build the site and deploy the `.netlify/functions/sendTelegram.js` serverless function.

## Lead Generation Setup (Telegram)

1. Open Telegram and search for `@BotFather`.
2. Type `/newbot` and follow the instructions to create a bot.
3. Copy the HTTP API Token provided by BotFather (This is your `BOT_TOKEN`).
4. Search for `@userinfobot` or `@RawDataBot` in Telegram to find your personal or group Chat ID (This is your `CHAT_ID`).
5. Add your new bot to your Telegram group, or start a chat with it directly.
6. Provide these credentials as Environment Variables in Netlify.
