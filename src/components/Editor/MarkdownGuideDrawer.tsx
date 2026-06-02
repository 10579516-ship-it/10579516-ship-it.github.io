import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Drawer } from '@/components/ui/Drawer';
import { markdownGuide } from '@/data/markdownGuide';

interface MarkdownGuideDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Right-side drawer with the Markdown cheatsheet.
 * Renders the same `markdownGuide.ts` content via ReactMarkdown
 * (so what you see is what the editor will produce).
 */
export function MarkdownGuideDrawer({ open, onClose }: MarkdownGuideDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} title="Markdown Guide" width="w-[520px] max-w-[92vw]">
      <div className="p-6">
        <article data-theme="notion-classic" className="prose-ghost">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownGuide}</ReactMarkdown>
        </article>
      </div>
    </Drawer>
  );
}
