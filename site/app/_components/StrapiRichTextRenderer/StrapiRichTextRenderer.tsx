'use client'
import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import { JSX } from "react/jsx-dev-runtime";

export default function StrapiRichTextRenderer({ content }: { content: BlocksContent }) {
  return <BlocksRenderer content={content} blocks={{
    paragraph: ({ children }) => <p className="BodyLarge" style={{marginBottom: '0.5rem'}}>{children}</p>,
    heading: ({ children, level }) => {
      const adjustedLevel = level + 1;
      const HeadingTag = `h${adjustedLevel}` as keyof JSX.IntrinsicElements;
      return <HeadingTag style={{ marginTop: '1rem' }} className={`H${adjustedLevel}`}>{children}</HeadingTag>;
    },
    link: ({ children, url }) => (
      <a href={url} target="_blank" className="Link" style={{ textDecoration: 'underline', color: 'rgb(var(--color-font-primary))' }}>
        {children}
      </a>
    ),
  }}
  modifiers={{
    bold: ({ children }) => <strong>{children}</strong>,

  }}
   />
}