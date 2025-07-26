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

## 🎉 Decap CMS Setup

### What's Already Configured
- ✅ Decap CMS admin interface at `/admin`
- ✅ Configuration for blog posts and videos
- ✅ Content collections setup
- ✅ Media upload folder configured

### To Complete Setup

#### 1. For Netlify Deployment (Recommended)
1. Deploy to Netlify
2. Enable Netlify Identity:
   - Go to Site Settings → Identity
   - Click "Enable Identity"
   - Set registration to "Invite only"
3. Enable Git Gateway:
   - In Identity settings, click "Git Gateway"
   - Click "Enable Git Gateway"
4. Invite users:
   - Go to Identity tab
   - Click "Invite users"
   - Add email addresses for content managers

#### 2. For GitHub Authentication (Alternative)
Update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: your-username/your-repo-name
  branch: main
```

### Accessing the CMS
- Local development: `http://localhost:3000/admin`  
- Production: `https://virtualadventurekillarney.com/admin`

### Adding Content
1. Go to `/admin`
2. Login with Netlify Identity or GitHub
3. Create new blog posts or videos
4. Content is saved to `content/` folder
5. Changes trigger automatic deployment

## 🏃‍♂️ Quick Start

1. **Fix environment variables** (see above)
2. **Run the development server**:
   ```bash
   npm run dev
   ```
3. **Visit your site**: `http://localhost:3000`
4. **Access CMS**: `http://localhost:3000/admin`

## 📂 Content Structure

```
content/
├── blog/           # Blog posts (.md files)
└── videos/         # Video gallery (.md files)
```

Each content file has frontmatter with metadata and markdown body content. 