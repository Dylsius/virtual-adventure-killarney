export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  image?: string;
  excerpt?: string;
  body: string;
  published: boolean;
}

export interface VideoItem {
  slug: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail?: string;
  date: string;
  published: boolean;
}

// Parse frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, string | boolean | number>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2];
  
  // Simple YAML parser for frontmatter
  const frontmatter: Record<string, string | boolean | number> = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value: string | boolean | number = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if (typeof value === 'string' && 
          ((value.startsWith('"') && value.endsWith('"')) || 
           (value.startsWith("'") && value.endsWith("'")))) {
        value = value.slice(1, -1);
      }
      
      // Convert boolean strings
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

// Load blog posts from the content directory
export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    // Use Vite's import.meta.glob to load all markdown files from content/blog
    const blogModules = import.meta.glob('/content/blog/*.md', { as: 'raw' });
    const posts: BlogPost[] = [];

    for (const [path, moduleLoader] of Object.entries(blogModules)) {
      try {
        const content = await moduleLoader();
        const { frontmatter, body } = parseFrontmatter(content);
        
        // Extract slug from filename
        const filename = path.split('/').pop() || '';
        const slug = filename.replace('.md', '');
        
        const post: BlogPost = {
          slug,
          title: String(frontmatter.title || 'Untitled'),
          date: String(frontmatter.date || new Date().toISOString()),
          author: String(frontmatter.author || 'Virtual Adventure Killarney'),
          image: frontmatter.image ? String(frontmatter.image) : undefined,
          excerpt: frontmatter.excerpt ? String(frontmatter.excerpt) : undefined,
          body: body.trim(),
          published: Boolean(frontmatter.published !== false) // Default to true if not specified
        };

        posts.push(post);
      } catch (error) {
        console.error(`Error processing blog post ${path}:`, error);
      }
    }

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    // Fallback to sample post if there's an error
    const samplePost: BlogPost = {
      slug: 'welcome-to-virtual-adventure',
      title: 'Welcome to Virtual Adventure Killarney',
      date: '2025-01-17T10:00:00.000Z',
      author: 'Virtual Adventure Killarney',
      image: 'https://i.imgur.com/29UVJAB.jpeg',
      excerpt: 'Experience the future of entertainment with our cutting-edge VR experiences in the heart of Killarney.',
      body: `# Welcome to Virtual Adventure Killarney

We're excited to welcome you to the most immersive virtual reality experience in Killarney! Our state-of-the-art VR arcade offers a wide range of experiences suitable for all ages.

## What We Offer

- **6 Different VR Experiences**: From racing simulators to relaxing virtual environments
- **Family-Friendly**: Experiences suitable for ages 4 and up
- **Group Bookings**: Perfect for birthday parties, team building, or family outings
- **Professional Equipment**: Latest VR technology for the best possible experience

## Book Your Adventure Today

Ready to step into another world? Book your VR experience today and discover what makes Virtual Adventure Killarney the premier destination for virtual reality entertainment.

Visit our booking page or call us at +353 (87) 483 8264 to reserve your spot!`,
      published: true
    };

    return [samplePost];
  }
}

// Load video gallery items from the content directory
export async function loadVideoItems(): Promise<VideoItem[]> {
  try {
    // Use Vite's import.meta.glob to load all markdown files from content/videos
    const videoModules = import.meta.glob('/content/videos/*.md', { as: 'raw' });
    const videos: VideoItem[] = [];

    for (const [path, moduleLoader] of Object.entries(videoModules)) {
      try {
        const content = await moduleLoader();
        const { frontmatter } = parseFrontmatter(content);
        
        // Extract slug from filename
        const filename = path.split('/').pop() || '';
        const slug = filename.replace('.md', '');
        
        const video: VideoItem = {
          slug,
          title: String(frontmatter.title || 'Untitled Video'),
          description: frontmatter.description ? String(frontmatter.description) : undefined,
          video_url: String(frontmatter.video_url || ''),
          thumbnail: frontmatter.thumbnail ? String(frontmatter.thumbnail) : undefined,
          date: String(frontmatter.date || new Date().toISOString()),
          published: Boolean(frontmatter.published !== false) // Default to true if not specified
        };

        videos.push(video);
      } catch (error) {
        console.error(`Error processing video item ${path}:`, error);
      }
    }

    // Sort videos by date (newest first)
    videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return videos;
  } catch (error) {
    console.error('Error loading video items:', error);
    // Fallback to sample video if there's an error
    const sampleVideo: VideoItem = {
      slug: 'vr-experience-showcase',
      title: 'VR Experience Showcase',
      description: 'Get a glimpse of the amazing VR experiences waiting for you at Virtual Adventure Killarney',
      video_url: 'https://res.cloudinary.com/darq9ofvp/video/upload/v1752331524/VR-Killarney_cgoz2u.mov',
      thumbnail: 'https://i.imgur.com/29UVJAB.jpeg',
      date: '2025-01-17T10:00:00.000Z',
      published: true
    };

    return [sampleVideo];
  }
}