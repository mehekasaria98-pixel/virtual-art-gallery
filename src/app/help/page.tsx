import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HelpLayout } from '@/components/help/HelpLayout';

export const metadata: Metadata = {
  title: 'Guide',
  description: 'How to use Atlas of Art: exploring by region, era and style, views, favourites and sharing.',
};

// Built once at deploy time from docs/user-guide, so the in-app guide and the repository docs never drift apart.
export const dynamic = 'force-static';

const CHAPTERS = [
  'getting-started',
  'exploring-by-region',
  'exploring-by-era',
  'exploring-by-style',
  'views',
  'artwork-details',
  'favourites',
  'sharing-links',
  'faq',
];

async function loadChapter(slug: string) {
  const file = path.join(process.cwd(), 'docs', 'user-guide', `${slug}.md`);
  const md = await readFile(file, 'utf8');
  const title = md.match(/^#\s+(.+)$/m)?.[1] ?? slug;
  return { slug, title, md };
}

export default async function HelpPage() {
  const chapters = await Promise.all(CHAPTERS.map(loadChapter));
  return (
    <HelpLayout toc={chapters.map(({ slug, title }) => ({ slug, title }))}>
      {chapters.map((c) => (
        <section key={c.slug} id={c.slug} style={{ scrollMarginTop: 80 }}>
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Cross-links between guide files become in-page anchors.
              a: ({ href = '', children }) => {
                const local = href.match(/^(?:\.\/)?([\w-]+)\.md(#.*)?$/);
                if (local) return <a href={`#${local[1]}`}>{children}</a>;
                const external = /^https?:/.test(href);
                return (
                  <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {children}
                  </a>
                );
              },
              img: () => null,
            }}
          >
            {c.md}
          </Markdown>
          <hr style={{ border: 0, borderTop: '1px solid var(--gallery-border)', margin: '2.5rem 0' }} />
        </section>
      ))}
    </HelpLayout>
  );
}
