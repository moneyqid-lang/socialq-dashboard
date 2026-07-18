# Setup Clerk Authentication

## 1. Create Clerk Account

1. Go to https://clerk.com
2. Click "Start Building" or "Sign Up"
3. Sign up with GitHub or email

## 2. Create Application

1. Click "Add Application"
2. Name: `SocialQ`
3. Select sign-in methods:
   - ✅ Email
   - ✅ Google (optional)
   - ✅ GitHub (optional)
4. Click "Create Application"

## 3. Get API Keys

1. Go to **API Keys** in the left sidebar
2. Copy these values:
   - **Publishable Key**: `pk_test_...` or `pk_live_...`
   - **Secret Key**: `sk_test_...` or `sk_live_...`

## 4. Configure Redirect URLs

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable Email (if not already)

3. Go to **Paths** in the left sidebar
4. Set these paths:
   - Sign-in URL: `/login`
   - Sign-up URL: `/register`
   - After sign-in URL: `/`
   - After sign-up URL: `/`

## 5. Add to Environment Variables

Create `.env.local` file in `socialq-dashboard/`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 6. Test Locally

```bash
cd socialq-dashboard
npm run dev
```

Visit http://localhost:3000/login — you should see the Clerk sign-in form.

## Troubleshooting

- **"Missing publishable key"**: Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- **Redirect loop**: Check that sign-in/sign-up paths match your routes
- **CORS errors**: Add `http://localhost:3000` to allowed origins in Clerk dashboard
