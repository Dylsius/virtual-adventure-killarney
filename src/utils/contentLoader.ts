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
function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2] || '';
  
  // Simple YAML parser for frontmatter
  const frontmatter: any = {};
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Convert boolean strings
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body: body.trim() };
}

// Utility to fetch and parse markdown content
async function fetchMarkdownContent(path: string): Promise<{ frontmatter: Record<string, unknown>; body: string } | null> {
  try {
    const response = await fetch(path);
    if (response.ok) {
      const content = await response.text();
      return parseFrontmatter(content);
    }
  } catch {
    console.log(`Could not load content from ${path}`);
  }
  return null;
}

// Load blog posts from the content directory
export async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts: BlogPost[] = [];
    
    // Try to load from actual markdown files
    try {
      // In production (Netlify), we'll fetch the files
      const response = await fetch('/content/blog/');
      if (response.ok) {
        // Parse directory listing (this would work on some static hosts)
        // For now, we'll manually load known files
      }
    } catch {
      console.log('Directory listing not available, trying known files');
    }

    // Try to load the sample blog post we know exists
    const blogContent = await fetchMarkdownContent('/content/blog/2025-07-25-blog-test.md');
    if (blogContent) {
      const { frontmatter, body } = blogContent;
      posts.push({
        slug: '2025-07-25-blog-test',
        title: (frontmatter.title as string) || 'Blog Test',
        date: (frontmatter.date as string) || '2025-07-25T10:00:00.000Z',
        author: (frontmatter.author as string) || 'Virtual Adventure Killarney',
        image: frontmatter.image as string | undefined,
        excerpt: frontmatter.excerpt as string | undefined,
        body: body,
        published: frontmatter.published !== false
      });
    }

    // If no posts loaded from files, return sample post
    if (posts.length === 0) {
      const samplePost: BlogPost = {
        slug: 'welcome-to-virtual-adventure',
        title: 'Welcome to Virtual Adventure Killarney',
        date: '2025-01-17T10:00:00.000Z',
        author: 'Virtual Adventure Killarney',
        image: 'https://i.imgur.com/29UVJAB.jpeg',
        excerpt: 'Experience the future of entertainment with our cutting-edge VR experiences in the heart of Killarney.',
        body: 'Welcome to Virtual Adventure Killarney!\n\nWe\'re excited to welcome you to the most immersive virtual reality experience in Killarney! Our state-of-the-art VR arcade offers a wide range of experiences suitable for all ages.\n\n**What We Offer:**\n- 6 Different VR Experiences: From racing simulators to relaxing virtual environments\n- Family-Friendly: Experiences suitable for ages 4 and up\n- Group Bookings: Perfect for birthday parties, team building, or family outings\n- Professional Equipment: Latest VR technology for the best possible experience\n\n**Book Your Adventure Today**\n\nReady to step into another world? Book your VR experience today and discover what makes Virtual Adventure Killarney the premier destination for virtual reality entertainment.\n\nVisit our booking page or call us at +353 (87) 483 8264 to reserve your spot!',
        published: true
      };
      posts.push(samplePost);
    }

    return posts.filter(post => post.published);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

// Load video gallery items from the content directory
export async function loadVideoItems(): Promise<VideoItem[]> {
  try {
    const videos: VideoItem[] = [];
    
    // Try to load the sample video file we know exists
    const videoContent = await fetchMarkdownContent('/content/videos/vr-experience-showcase.md');
    if (videoContent) {
      const { frontmatter, body } = videoContent;
      videos.push({
        slug: 'vr-experience-showcase',
        title: (frontmatter.title as string) || 'VR Experience Showcase',
        description: (frontmatter.description as string) || (body ? body.substring(0, 200) + '...' : ''),
        video_url: (frontmatter.video_url as string) || 'https://res.cloudinary.com/darq9ofvp/video/upload/v1752331524/VR-Killarney_cgoz2u.mov',
        thumbnail: (frontmatter.thumbnail as string) || 'https://i.imgur.com/29UVJAB.jpeg',
        date: (frontmatter.date as string) || '2025-01-17T10:00:00.000Z',
        published: frontmatter.published !== false
      });
    }

    // If no videos loaded from files, return sample video
    if (videos.length === 0) {
      const sampleVideo: VideoItem = {
        slug: 'vr-experience-showcase',
        title: 'VR Experience Showcase',
        description: 'Get a glimpse of the amazing VR experiences waiting for you at Virtual Adventure Killarney',
        video_url: 'https://res.cloudinary.com/darq9ofvp/video/upload/v1752331524/VR-Killarney_cgoz2u.mov',
        thumbnail: 'https://i.imgur.com/29UVJAB.jpeg',
        date: '2025-01-17T10:00:00.000Z',
        published: true
      };
      videos.push(sampleVideo);
    }

    return videos.filter(video => video.published);
  } catch (error) {
    console.error('Error loading video items:', error);
    return [];
  }
}