import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

function getSlug(id: string): string {
  return id.replace(/\.(md|mdx)$/, '');
}

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Your Site Name', // Update with your site name
    description: 'Your site description', // Update with your site description
    site: context.site ?? 'https://example.com',
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${getSlug(post.id)}/`,
        author: post.data.author,
        categories: post.data.tags,
      })),
    customData: `<language>en-us</language>`,
  });
}
