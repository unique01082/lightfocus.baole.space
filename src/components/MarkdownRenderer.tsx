import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Task-related custom rendering
        strong: ({ children }) => (
          <strong className="text-indigo-300 font-bold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-purple-300 italic">{children}</em>
        ),
        code: ({ children, className: codeClassName }) => {
          const isInline = !codeClassName;
          if (isInline) {
            return (
              <code className="bg-indigo-900/60 text-indigo-200 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-500/30">
                {children}
              </code>
            );
          }
          return (
            <code className={`block bg-black/40 text-indigo-200 p-3 rounded-lg text-sm font-mono border border-indigo-500/20 my-2 overflow-x-auto ${codeClassName || ''}`}>
              {children}
            </code>
          );
        },
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 my-2 ml-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 my-2 ml-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-inherit">{children}</li>
        ),
        h1: ({ children }) => (
          <h1 className="text-lg font-bold text-white mt-3 mb-1">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold text-white mt-2 mb-1">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold text-white mt-2 mb-1">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="my-1">{children}</p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-indigo-400/50 pl-3 my-2 text-indigo-200/80 italic">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full text-sm border border-indigo-500/30 rounded">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-3 py-1.5 bg-indigo-900/50 text-indigo-200 font-mono text-xs border border-indigo-500/20 text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-1.5 border border-indigo-500/20 text-sm">
            {children}
          </td>
        ),
        hr: () => (
          <hr className="border-indigo-500/30 my-3" />
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            {children}
          </a>
        ),
        // Task-specific: render checkboxes in lists
        input: ({ type, checked, ...props }) => {
          if (type === 'checkbox') {
            return (
              <span className={`inline-block w-4 h-4 rounded border mr-2 align-middle ${
                checked
                  ? 'bg-green-500/60 border-green-400/50 text-green-200'
                  : 'bg-indigo-900/40 border-indigo-500/30'
              }`}>
                {checked && <span className="block text-center text-xs leading-4">✓</span>}
              </span>
            );
          }
          return <input type={type} checked={checked} {...props} />;
        },
      }}
    >
      {content}
    </Markdown>
    </div>
  );
}
