import type { BlockWithChildren } from "@/lib/notion";

/** RichText 배열에서 plain_text를 추출해 연결합니다 */
function getRichText(richText: { plain_text: string }[]): string {
  return richText.map((t) => t.plain_text).join("");
}

interface BlockRendererProps {
  block: BlockWithChildren;
}

/**
 * Notion 블록을 React 요소로 변환합니다.
 * has_children 블록은 children을 재귀 렌더링합니다.
 */
export function BlockRenderer({ block }: BlockRendererProps) {
  const { type, children } = block;

  const nestedBlocks = children?.length ? (
    <div className="ml-4">
      {children.map((child) => (
        <BlockRenderer key={child.id} block={child} />
      ))}
    </div>
  ) : null;

  switch (type) {
    case "paragraph": {
      const text = getRichText(block.paragraph.rich_text);
      return (
        <p>
          {text || <br />}
          {nestedBlocks}
        </p>
      );
    }

    case "heading_1": {
      return <h1>{getRichText(block.heading_1.rich_text)}</h1>;
    }

    case "heading_2": {
      return <h2>{getRichText(block.heading_2.rich_text)}</h2>;
    }

    case "heading_3": {
      return <h3>{getRichText(block.heading_3.rich_text)}</h3>;
    }

    case "bulleted_list_item": {
      return (
        <li>
          {getRichText(block.bulleted_list_item.rich_text)}
          {nestedBlocks}
        </li>
      );
    }

    case "numbered_list_item": {
      return (
        <li>
          {getRichText(block.numbered_list_item.rich_text)}
          {nestedBlocks}
        </li>
      );
    }

    case "code": {
      const text = getRichText(block.code.rich_text);
      const lang = block.code.language ?? "";
      return (
        <pre>
          <code className={lang ? `language-${lang}` : undefined}>
            {text}
          </code>
        </pre>
      );
    }

    case "quote": {
      return <blockquote>{getRichText(block.quote.rich_text)}</blockquote>;
    }

    case "divider": {
      return <hr />;
    }

    default:
      return null;
  }
}

/** 블록 배열을 렌더링합니다. bulleted/numbered 항목을 ul/ol로 감쌉니다 */
export function BlocksRenderer({ blocks }: { blocks: BlockWithChildren[] }) {
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: BlockWithChildren[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ul key={`ul-${items[0].id}`}>
          {items.map((b) => (
            <BlockRenderer key={b.id} block={b} />
          ))}
        </ul>
      );
    } else if (block.type === "numbered_list_item") {
      const items: BlockWithChildren[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ol key={`ol-${items[0].id}`}>
          {items.map((b) => (
            <BlockRenderer key={b.id} block={b} />
          ))}
        </ol>
      );
    } else {
      elements.push(<BlockRenderer key={block.id} block={block} />);
      i++;
    }
  }

  return <>{elements}</>;
}
