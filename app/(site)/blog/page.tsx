import type { Metadata } from "next";
import Link from "next/link";
import { BlogArt } from "@/components/site/art";
import { getAllPosts } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description: "Notes on clipping, posting, and what a retainer actually buys. Outlines until sources are filled in.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Blog</span>
          </nav>
          <p className="eyebrow">Notes from the lever</p>
          <h1>Blog</h1>
          <p className="lead">Practical posts from the content plan. Outlines first — stats only when sourced.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap blog-list">
          {posts.map((post) => (
            <Link className="blog-card" key={post.slug} href={`/blog/${post.slug}`}>
              <span className="art" aria-hidden="true">
                <BlogArt />
              </span>
              <span>
                <span className="todo">Draft</span>
                <h2 style={{ margin: "10px 0 8px", fontSize: 28 }}>{post.title}</h2>
                <p className="muted">{post.description}</p>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
