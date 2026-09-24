import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArt } from "@/components/site/art";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post" };
  return pageMeta({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

function blocks(content: string) {
  const lines = content.split("\n");
  const nodes: ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: string) => {
    if (!list.length) return;
    nodes.push(
      <ul key={key}>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      list.push(trimmed.slice(2));
      return;
    }
    flush(`list-${index}`);
    if (trimmed.startsWith("## ")) {
      nodes.push(<h2 key={index}>{trimmed.slice(3)}</h2>);
    } else if (trimmed) {
      nodes.push(<p key={index}>{trimmed}</p>);
    }
  });
  flush("end");
  return nodes;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  return (
    <article className="page-hero">
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span>{post.title}</span>
        </nav>
        <div style={{ borderRadius: 24, overflow: "hidden", marginBottom: 24 }}>
          <BlogArt />
        </div>
        <p className="eyebrow">Draft outline</p>
        <h1>{post.title}</h1>
        <p className="lead">{post.description}</p>
        <div className="prose">{blocks(post.content)}</div>
      </div>
    </article>
  );
}
