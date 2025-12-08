# Telegram Authentication Setup

This document describes the process of setting up Telegram authentication for the Beliarg application.

## Table of Contents

1. [Telegram Bot Authentication Setup](#telegram-bot-authentication-setup)
2. [Database Migration](#database-migration)

## Telegram Bot Authentication Setup

### Step 1: Create a Telegram Bot

1. Open Telegram and find [@BotFather](https://t.me/BotFather)
2. Send the `/newbot` command
3. Follow the instructions:
   - Enter the bot name (e.g., "Beliarg Auth Bot")
   - Enter the bot username (must end with `bot`, e.g., `beliarg_auth_bot`)
4. After creation, you will receive a **Bot Token** - save it!

### Step 2: Configure Web App for the Bot

1. Send BotFather the `/newapp` command
2. Select your bot from the list
3. Fill in the information:
   - **Title**: Beliarg (or any other name)
   - **Short name**: beliarg (must be unique)
   - **Description**: Description of your application
   - **Photo**: (optional) upload an icon
   - **Web App URL**: URL of your frontend (e.g., `https://yourdomain.com`)

### Step 3: Configure Environment Variables

Make sure your `.env` file contains:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
```

**Important**: Telegram Bot Authentication only works when the application is opened through Telegram Web App. Users must open your application through the bot in Telegram.

### Step 4: Telegram Web App Integration on Frontend

The application automatically detects if it's running in Telegram Web App and uses Telegram API for authentication. Make sure that:

1. Your application is accessible via HTTPS (Telegram requires HTTPS for Web Apps)
2. The Telegram Web App script is added to HTML (already added in `index.html`):

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

## Database Migration

Before using Telegram authentication, you need to apply the database migration:

```bash
psql -U postgres -d beliarg_db -f sql/add_oauth_fields_to_users.sql
```

Or if using a specific user:

```bash
psql -U beliarg_user -d beliarg_db -f sql/add_oauth_fields_to_users.sql
```

The migration will add the following fields to the `users` table:
- `provider_type` - provider type ('email', 'telegram')
- `provider_id` - user ID in the provider
- `name` - user name
- `avatar_url` - user avatar URL
- Makes `password_hash` optional (NULL for OAuth users)

## Verification

### Telegram Bot Authentication

1. Make sure `TELEGRAM_BOT_TOKEN` is set
2. Open your bot in Telegram
3. Click on the Web App button (if configured) or send a command to open the Web App
4. In the opened application, click "LOGIN WITH TELEGRAM"
5. Authentication will occur automatically using Telegram data

## Troubleshooting

### Telegram Bot Authentication Not Working

- Make sure the application is opened through Telegram Web App (not in a regular browser)
- Check that `TELEGRAM_BOT_TOKEN` is set correctly
- Ensure your application is accessible via HTTPS (for production)
- Check the browser console for errors
- Make sure the Telegram Web App script is loaded (check in DevTools)

### Database Errors

- Make sure the migration was applied successfully
- Check the database user's permissions
- Ensure the `users` table exists

## Security

- **Never commit** the `.env` file to git
- Use strong secret keys for production
- Regularly update Telegram Bot Token if necessary
- Use HTTPS in production (required for Telegram Web Apps)
- Verify Telegram data signatures on the server (already implemented)
