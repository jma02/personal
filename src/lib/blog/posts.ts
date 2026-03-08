export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  section: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'first-post',
    title: 'My First Blog Post',
    description: 'A short first post with a small mathematical example.',
    date: '2025-12-04',
    readTime: '2 min read',
    section: 'Post 01',
  },
];

export const firstPost = blogPosts[0];
