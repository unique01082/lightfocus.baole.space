import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import remarkGfm from 'remark-gfm';
import { CONTENT, TABS, type HelpTab } from './help-content';

const mdComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-white mb-6 pb-3 border-b border-purple-500/30">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-purple-200 mt-8 mb-3 flex items-center gap-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-purple-300 mt-5 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-purple-100/80 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-4 ml-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-4 ml-4 list-decimal">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-purple-100/80 leading-relaxed flex gap-2">
      <span className="text-purple-400 mt-1 shrink-0">•</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="text-purple-300 font-semibold">{children}</strong>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    return isBlock ? (
      <code className="block bg-black/40 border border-indigo-500/20 rounded-xl px-4 py-3 text-sm font-mono text-green-300/90 overflow-x-auto mb-4">
        {children}
      </code>
    ) : (
      <code className="px-1.5 py-0.5 bg-purple-700/40 border border-purple-500/30 rounded text-sm font-mono text-purple-200">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-purple-500/50 pl-4 my-4 text-purple-200/60 italic">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-purple-900/30">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left text-purple-300 font-semibold px-4 py-2.5 border border-purple-500/20">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="text-purple-100/70 px-4 py-2.5 border border-purple-500/15 font-mono text-xs">
      {children}
    </td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-purple-900/20 transition-colors">{children}</tr>
  ),
  hr: () => <hr className="border-purple-500/20 my-6" />,
};

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<HelpTab>('guide');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 py-8 px-4">
      <div className="max-w-4xl mx-auto mt-12">

        {/* Header */}
        <div className="text-center mb-10 animate-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-3">
            Help & Docs
          </h1>
          <p className="text-purple-200/80 text-lg">
            Everything you need to master LightFocus
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-black/30 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-1.5 mb-6 animate-in slide-in-from-top duration-500">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-purple-300/60 hover:text-purple-200 hover:bg-purple-500/10'
                }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border border-purple-400/20
          rounded-2xl p-8 shadow-xl shadow-purple-500/10 animate-in fade-in duration-500">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={mdComponents}
          >
            {CONTENT[activeTab]}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-in fade-in duration-700">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600
              hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-8 rounded-xl
              transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <span>←</span> Back to Solar System
          </Link>
        </div>
      </div>
    </div>
  );
}
