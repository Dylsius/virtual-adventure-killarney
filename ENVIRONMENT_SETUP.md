# Environment Setup for Virtual Adventure Killarney

## 🚨 Required: Fix Supabase Variables

Your app is currently crashing because Supabase environment variables are missing. Here's how to fix it:

### Option 1: Quick Fix (Dummy Values)
Create a `.env.local` file in your project root with dummy values:

```bash
# Create .env.local file
VITE_SUPABASE_URL=https://dummy.supabase.co
VITE_SUPABASE_ANON_KEY=dummy-key
```

### Option 2: Real Supabase Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy your Project URL and anon public key
5. Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🎉 Decap CMS Setup with Netlify Identity

### What's Already Configured
- ✅ Decap CMS admin interface at `/admin`
- ✅ Configuration for blog posts and videos
- ✅ Content collections setup
- ✅ Media upload folder configured
- ✅ Local backend enabled for development
- ✅ **Netlify Identity widget added for authentication**

### Complete Setup for Production

#### 1. Deploy to Netlify
1. Connect your repository to Netlify
2. Deploy your site (it will build automatically)

#### 2. Enable Netlify Identity (REQUIRED)
1. Go to your Netlify site dashboard
2. Navigate to **Site Settings → Identity**
3. Click **"Enable Identity"**
4. Under **Registration preferences**, select **"Invite only"** (recommended for security)
5. Scroll down to **Git Gateway** section
6. Click **"Enable Git Gateway"**

#### 3. Configure Identity Settings
**External Providers (Optional):**
- You can enable Google, GitHub, GitLab providers for easier login
- Go to **Settings → Identity → External providers**

**Confirmation Template:**
- Customize email templates in **Settings → Identity → Emails**

#### 4. Add CMS Users
1. Go to **Identity** tab in your Netlify dashboard
2. Click **"Invite users"**
3. Enter email addresses of people who should access the CMS
4. They'll receive invitation emails

#### 5. Test Your CMS
1. Visit: `https://virtualadventurekillarney.com/admin`
2. Click **"Login with Netlify Identity"**
3. Sign up/log in with invited email
4. Start creating content!

### For GitHub Authentication (Alternative)
If you prefer GitHub authentication instead of Netlify Identity:

Update `public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: your-username/your-repo-name
  branch: main
```

### Accessing the CMS

#### Local Development Setup (✅ Working!)
**Important:** You need to use `nvm use default` before npm commands!

**Run both commands in separate terminals:**

```bash
# Terminal 1: Start your React app
nvm use default && npm run dev
# ➜ App available at: http://localhost:5173

# Terminal 2: Start Decap CMS proxy server
nvm use default && npm run cms  
# ➜ Decap CMS Proxy Server listening on port 8081
```

**Access URLs:**
- **Your website**: `http://localhost:5173`
- **CMS Admin**: `http://localhost:5173/admin/index.html` (direct link)

#### Production
- **CMS Admin**: `https://virtualadventurekillarney.com/admin`
- **Authentication**: Users must be invited via Netlify Identity

### CMS User Flow
1. **Admin invites user** via Netlify Dashboard
2. **User receives email** with invitation link
3. **User sets password** and confirms account
4. **User can access CMS** at `/admin`
5. **Content is saved** to GitHub repository
6. **Site rebuilds automatically** when content is published

## 🏃‍♂️ Quick Start

1. **Fix environment variables** (create `.env.local` - see above)
2. **Start both servers** (use `nvm use default` first!):
   ```bash
   # Terminal 1
   nvm use default && npm run dev
   
   # Terminal 2  
   nvm use default && npm run cms
   ```
3. **Visit your site**: `http://localhost:5173`
4. **Access CMS**: `http://localhost:5173/admin/index.html`
5. **Deploy to Netlify** and configure Identity (see above)

### Alternative: Production-only CMS
If you don't need local CMS editing, just run:
```bash
nvm use default && npm run dev
```
The CMS will only work in production at `https://virtualadventurekillarney.com/admin`

## 📂 Content Structure

```
content/
├── blog/           # Blog posts (.md files)
└── videos/         # Video gallery (.md files)
```

Each content file has frontmatter with metadata and markdown body content.

## 🔍 Troubleshooting

### CMS Not Loading Locally?
- ✅ Use `nvm use default` before npm commands
- ✅ Make sure `npm run cms` is running (should show "listening on port 8081")
- ✅ Make sure `npm run dev` is running (app on port 5173)
- ✅ Access CMS at `http://localhost:5173/admin/index.html` (direct link)

### App Crashing?
- ✅ Create `.env.local` with Supabase variables (see above)

### Content Not Showing?
- ✅ Check that markdown files exist in `content/blog/` and `content/videos/`
- ✅ Verify frontmatter format in markdown files

### "npm: command not found"?
- ✅ Run `nvm use default` before any npm commands
- ✅ Make sure Node.js is installed via nvm

### CMS Authentication Issues?
- ✅ Ensure Netlify Identity is enabled in site settings
- ✅ Check that Git Gateway is enabled
- ✅ Verify users are invited via Netlify Dashboard
- ✅ Make sure you're accessing the production URL, not localhost for authentication

### Editorial Workflow
- ✅ Content goes through draft → review → published workflow
- ✅ Admins can review and publish submitted content
- ✅ Enable "show_preview_links" to see content before publishing 