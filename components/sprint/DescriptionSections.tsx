'use client';

import MarkdownRenderer from './MarkdownRenderer';
import { parseDescription } from '@/lib/parse-description';

interface DescriptionSectionsProps {
  content: string;
  taskIdentifier?: string;
}

export default function DescriptionSections({ content, taskIdentifier }: DescriptionSectionsProps) {
  const { sections } = parseDescription(content);

  return (
    <>
      {sections.map((section, index) => (
        <div key={index} className="glass rounded-2xl p-6 md:p-8 mb-6 overflow-hidden">
          {section.title && (
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {section.title}
            </h2>
          )}
          <div className="max-w-none">
            <MarkdownRenderer content={section.content} taskIdentifier={taskIdentifier} />
          </div>
        </div>
      ))}
    </>
  );
}
