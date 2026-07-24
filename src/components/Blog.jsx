import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import Modal from './Modal';
import ProjectCover from './ProjectCover';
import SectionTitle from './SectionTitle';
import { blogPosts } from '../data/blog';
import { stagger, rise, inView, spring } from './anim';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function PostBody({ post }) {
  if (!post) return null;
  return (
    <>
      <div className="relative h-40 overflow-hidden rounded-t-3xl sm:h-48">
        <ProjectCover kind={post.cover} seed={post.slug} />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-accent-soft bg-accent/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent"
            >
              {t}
            </span>
          ))}
        </div>

        <h3 id="blog-modal-title" className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">
          {post.title}
        </h3>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-body">
          <span>Pranav Verma</span>
          <span className="text-body/50">·</span>
          <span>{fmtDate(post.date)}</span>
          <span className="text-body/50">·</span>
          <span>{post.readMins} min read</span>
        </p>

        <div className="mt-7 flex flex-col gap-5">
          {post.body.map((b, i) => {
            if (b.type === 'h2')
              return (
                <h4 key={i} className="mt-3 text-xl font-bold text-white">
                  {b.text}
                </h4>
              );
            if (b.type === 'h3')
              return (
                <h5 key={i} className="mt-2 text-lg font-semibold text-lightn">
                  {b.text}
                </h5>
              );
            if (b.type === 'quote')
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-accent/60 pl-5 text-[15px] italic leading-relaxed text-lightn/80"
                >
                  {b.text}
                </blockquote>
              );
            if (b.type === 'list')
              return (
                <ul key={i} className="flex flex-col gap-3">
                  {b.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[15px] leading-relaxed text-body">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {it}
                    </li>
                  ))}
                </ul>
              );
            if (b.type === 'code')
              return (
                <pre
                  key={i}
                  className="overflow-x-auto rounded-xl bg-ink/70 p-4 font-mono text-[13px] text-lightn shadow-neu-inset"
                >
                  <code>{b.text}</code>
                </pre>
              );
            return (
              <p key={i} className="text-[15px] leading-relaxed text-body">
                {b.text}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PostCard({ post, onOpen, featured }) {
  return (
    <motion.button
      variants={rise}
      onClick={onOpen}
      whileHover={{ y: -8 }}
      transition={spring}
      className={`group relative overflow-hidden rounded-3xl bg-surface text-left shadow-neu transition-shadow hover:shadow-neu-glow ${
        featured ? 'md:grid md:grid-cols-2' : 'flex flex-col'
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-52 md:h-full md:min-h-[260px]' : 'h-40'}`}>
        <ProjectCover kind={post.cover} seed={post.slug} />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent ${
            featured ? 'md:bg-gradient-to-r' : ''
          }`}
        />
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-accent-soft bg-accent/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent"
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-xl font-bold leading-snug text-white transition-colors group-hover:text-accent sm:text-2xl">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-body">{post.excerpt}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-2.5 text-xs text-body">
          <span>{fmtDate(post.date)}</span>
          <span className="text-body/50">·</span>
          <span>{post.readMins} min read</span>
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-lightn/70 transition-colors group-hover:text-accent">
          Read article
          <Icon
            name="arrow-up-right"
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </span>
      </div>
    </motion.button>
  );
}

export default function Blog() {
  const [active, setActive] = useState(null);
  const [featured, ...rest] = blogPosts;

  return (
    <section id="blog" className="border-t border-white/5 py-24 sm:py-28">
      <div className="container-px">
        <SectionTitle eyebrow="Writing" title="Notes on GenAI & data" />
        <p className="mx-auto mt-4 max-w-2xl text-center text-fluid-lead leading-relaxed text-body">
          Long-form pieces on token economics, retrieval, and what actually breaks in production LLM
          systems.
        </p>

        <motion.div variants={stagger(0.12)} {...inView} className="mt-14 flex flex-col gap-6">
          <PostCard post={featured} featured onOpen={() => setActive(featured)} />
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              {rest.map((p) => (
                <PostCard key={p.slug} post={p} onOpen={() => setActive(p)} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} labelledBy="blog-modal-title">
        <PostBody post={active} />
      </Modal>
    </section>
  );
}
