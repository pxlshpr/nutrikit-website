'use client';

import MarkdownRenderer from './MarkdownRenderer';

interface DescriptionSectionsProps {
  content: string;
  taskIdentifier?: string;
}

export interface ParsedDescription {
  preamble: string;
  hasTechnicalDetails: boolean;
  sections: { title: string; content: string }[];
}

export function parseDescription(markdown: string): ParsedDescription {
  const lines = markdown.split('\n');
  const sections: { title: string; content: string }[] = [];
  let preamble = '';
  let hasTechnicalDetails = false;
  let currentSection: { title: string; content: string } | null = null;
  let inPreamble = true;

  for (const line of lines) {
    // Check if line is an H2 header (## Title)
    const h2Match = line.match(/^##\s+(.+)$/);
    // Check if line is "Technical details:" (case insensitive)
    const technicalDetailsMatch = line.match(/^Technical details:?\s*$/i);

    if (technicalDetailsMatch && inPreamble) {
      hasTechnicalDetails = true;
      inPreamble = false;
      continue;
    }

    if (h2Match) {
      inPreamble = false;
      // Save previous section if it has content
      if (currentSection && (currentSection.content.trim() || currentSection.title)) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content.trim(),
        });
      }
      // Start new section
      currentSection = {
        title: h2Match[1].trim(),
        content: '',
      };
    } else if (inPreamble) {
      preamble += line + '\n';
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  // Add the last section
  if (currentSection && (currentSection.content.trim() || currentSection.title)) {
    sections.push({
      title: currentSection.title,
      content: currentSection.content.trim(),
    });
  }

  return {
    preamble: preamble.trim(),
    hasTechnicalDetails,
    sections,
  };
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
