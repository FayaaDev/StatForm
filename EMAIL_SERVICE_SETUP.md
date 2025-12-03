# Email Service Setup Guide

This guide explains how to set up the email service for StatForm's custom form request feature.

## Overview

The email service uses [Resend](https://resend.com) - a modern email API service that's perfect for Netlify Functions and provides excellent deliverability.

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (includes 3,000 emails/month for free)
3. Verify your email address

### 2. Add and Verify Your Domain

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain: `statform.app`
4. Add the DNS records shown by Resend to your domain provider:
   - SPF record
   - DKIM records (2 records)
   - DMARC record (optional but recommended)
5. Wait for verification (usually takes 5-15 minutes)

### 3. Create an API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "StatForm Production")
4. Select permissions: **Sending access**
5. Copy the API key (you won't see it again!)

### 4. Add API Key to Netlify

1. Go to your Netlify dashboard
2. Select your StatForm site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add:
   - **Key**: `RESEND_API_KEY`
   - **Value**: [paste your Resend API key]
6. Click **Save**

### 5. Deploy and Test

1. Deploy your site (Netlify will pick up the new environment variable)
2. Test the custom form request feature on your live site
3. Check that emails arrive at drfayaa@gmail.com

## Alternative: SendGrid Setup

If you prefer SendGrid instead of Resend, follow these steps:

### 1. Create SendGrid Account
- Go to [sendgrid.com](https://sendgrid.com)
- Sign up (free tier includes 100 emails/day)

### 2. Create API Key
- Go to Settings → API Keys
- Create API Key with "Mail Send" permissions

### 3. Update the Function
Replace the Resend code in `/netlify/functions/send-request-email.js` with SendGrid:

```javascript
// Install @sendgrid/mail: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';

export const handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Method Not Allowed" }) 
        };
    }

    try {
        const { email, formName, details } = JSON.parse(event.body);

        if (!email || !formName || !details) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields" }),
            };
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: 'drfayaa@gmail.com',
            from: 'noreply@statform.app', // Use verified sender
            replyTo: email,
            subject: `Custom Form Request: ${formName}`,
            html: `<h2>New Custom Form Request</h2>
                   <p><strong>From:</strong> ${email}</p>
                   <p><strong>Form Name:</strong> ${formName}</p>
                   <h3>Details:</h3>
                   <p>${details.replace(/\n/g, '<br>')}</p>`,
        };

        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send email" }),
        };
    }
};
```

### 4. Add to Netlify
Add `SENDGRID_API_KEY` environment variable to Netlify.

## Troubleshooting

### Emails not arriving
- Check Resend/SendGrid dashboard for delivery status
- Verify domain DNS records are correct
- Check spam folder
- Ensure API key has sending permissions

### Function errors
- Check Netlify function logs: Site → Functions → View logs
- Verify environment variable is set correctly
- Test locally with `netlify dev`

### Local Development

To test locally:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Create `.env` file in project root:
   ```
   RESEND_API_KEY=your_api_key_here
   ```
3. Run: `netlify dev`
4. Test the form at `http://localhost:8888`

## Security Notes

- Never commit API keys to git
- Use environment variables for all sensitive data
- Rotate API keys periodically
- Monitor email sending limits and usage

## Cost

**Resend Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Perfect for small to medium traffic

**SendGrid Free Tier:**
- 100 emails/day
- Good for low traffic sites

For higher volumes, both services offer paid plans starting around $10-20/month.
