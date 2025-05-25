/**
 * Utility functions for formatting message content
 */
import DOMPurify from 'isomorphic-dompurify';

/**
 * Formats bold text with ** markers
 * @param text Text to format
 * @returns Formatted text with <strong> tags
 */
export const formatBoldText = (text: string): string => {
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

/**
 * Formats code blocks with ``` markers
 * @param text Text to format
 * @returns Formatted text with code blocks
 */
export const formatCodeBlocks = (text: string): string => {
  // Replace ```code``` with formatted code blocks
  return text.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
};

/**
 * Formats markdown headers
 * @param text Text to format
 * @returns Formatted text with header tags
 */
export const formatMarkdownHeaders = (text: string): string => {
  // Replace ### Header with formatted headers
  return text.replace(/^(#{1,6})\s+(.*?)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level} class="markdown-header">${content}</h${level}>`;
  });
};

/**
 * Formats block quotes
 * @param text Text to format
 * @returns Formatted text with blockquote elements
 */
export const formatBlockQuotes = (text: string): string => {
  // Replace lines starting with > with blockquote elements
  const lines = text.split('\n');
  let inBlockquote = false;
  let result = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('>')) {
      // Extract the content after >
      const content = line.trim().substring(1).trim();

      if (!inBlockquote) {
        // Start a new blockquote
        result += '<blockquote class="block-quote">';
        inBlockquote = true;
      }

      result += content + (i < lines.length - 1 ? '<br>' : '');
    } else {
      if (inBlockquote) {
        // Close the blockquote
        result += '</blockquote>';
        inBlockquote = false;
      }

      result += line + (i < lines.length - 1 ? '\n' : '');
    }
  }

  // Close any open blockquote
  if (inBlockquote) {
    result += '</blockquote>';
  }

  return result;
};

/**
 * Formats links in text
 * @param text Text to format
 * @returns Formatted text with anchor tags
 */
export const formatLinks = (text: string): string => {
  // URL regex pattern
  const urlPattern = /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/g;

  // Replace URLs with anchor tags
  return text.replace(urlPattern, (url) => {
    // Try to create a readable link text
    let displayUrl = url;
    try {
      const urlObj = new URL(url);
      displayUrl = urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
      // Truncate if too long
      if (displayUrl.length > 30) {
        displayUrl = displayUrl.substring(0, 30) + '...';
      }
    } catch (e) {
      // If URL parsing fails, use the original URL
    }

    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${displayUrl}</a>`;
  });
};

/**
 * Gets the indentation level of a line
 * @param line Line to check
 * @returns Number of spaces at the beginning of the line
 */
export const getIndentationLevel = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

/**
 * Processes a list (either bulleted or numbered)
 * @param lines Lines of text
 * @param startIndex Start index in the lines array
 * @param baseIndentation Base indentation level
 * @returns Processed list items
 */
export const processList = (lines: string[], startIndex: number, baseIndentation: number) => {
  const result = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    const indentation = getIndentationLevel(line);

    // If we encounter a line with less indentation than our base, we're done with this list
    if (indentation < baseIndentation) {
      break;
    }

    // If this is a new list item at our current level
    if (indentation === baseIndentation) {
      const trimmedLine = line.trim();
      const isBullet = trimmedLine.match(/^[*-]\s/);
      const isNumbered = trimmedLine.match(/^\d+\.\s/);

      if (isBullet || isNumbered) {
        // Extract the content without the bullet/number
        let itemContent = isBullet 
          ? trimmedLine.replace(/^[*-]\s/, '') 
          : isNumbered 
            ? trimmedLine.replace(/^\d+\.\s/, '')
            : trimmedLine;

        // Check for nested list
        let nestedContent = [];
        let j = i + 1;

        // Look ahead for nested items
        while (j < lines.length && getIndentationLevel(lines[j]) > baseIndentation) {
          nestedContent.push(lines[j]);
          j++;
        }

        // Process nested content if any
        let nestedItems = [];
        if (nestedContent.length > 0) {
          // Find the indentation of the first nested item
          const nestedIndentation = getIndentationLevel(nestedContent[0]);
          nestedItems = processList(lines, i + 1, nestedIndentation);
          i = j - 1; // Skip the nested items in the main loop
        }

        result.push({
          content: itemContent,
          type: isBullet ? 'bullet' : 'numbered',
          number: isNumbered ? parseInt(trimmedLine.match(/^(\d+)\./)[1]) : null,
          nested: nestedItems
        });
      }
    }

    i++;
  }

  return result;
};

/**
 * Renders a list item with its nested content
 * @param item List item to render
 * @param index Index of the item
 * @param parentKey Parent key for React
 * @returns JSX element
 */
export const renderListItem = (item: any, index: number, parentKey: string) => {
  const key = `${parentKey}-${index}`;

  // Render bullet point
  if (item.type === 'bullet') {
    return (
      <li key={key}>
        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
        {item.nested.length > 0 && (
          <ul className="list-disc pl-5 mt-1 space-y-1">
            {item.nested.map((nestedItem: any, nestedIndex: number) => 
              renderListItem(nestedItem, nestedIndex, key)
            )}
          </ul>
        )}
      </li>
    );
  }

  // Render numbered item
  return (
    <div key={key} className="flex mb-1">
      <span className="mr-2 flex-shrink-0 w-5 text-right">{item.number}.</span>
      <div className="flex-1">
        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
        {item.nested.length > 0 && (
          <div className="pl-5 mt-1 space-y-1">
            {item.nested.map((nestedItem: any, nestedIndex: number) => 
              renderListItem(nestedItem, nestedIndex, key)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Formats message content with proper paragraphs and lists
 * @param text Text to format
 * @returns JSX elements
 */
export const formatMessageContent = (text: string) => {
  // Apply code block formatting first (to avoid conflicts with other formatting)
  const textWithCodeBlocks = formatCodeBlocks(text);

  // Apply markdown headers formatting
  const textWithHeaders = formatMarkdownHeaders(textWithCodeBlocks);

  // Apply block quote formatting
  const textWithBlockQuotes = formatBlockQuotes(textWithHeaders);

  // Apply bold formatting
  const textWithBoldFormatting = formatBoldText(textWithBlockQuotes);

  // Apply link formatting
  const textWithLinks = formatLinks(textWithBoldFormatting);

  // Split the text by double line breaks to create paragraphs
  const paragraphs = textWithLinks.split(/\n\s*\n/);

  return paragraphs.map((paragraph, index) => {
    // Check if the paragraph contains list items
    if (paragraph.trim().match(/^(\s*)[*-]\s/m) || paragraph.trim().match(/^(\s*)\d+\.\s/m)) {
      // Split into lines and process as a list
      const lines = paragraph.split(/\n/).filter(line => line.trim());
      const listItems = processList(lines, 0, getIndentationLevel(lines[0]));

      // Determine if this is primarily a bullet list or numbered list
      const isBulletList = listItems.length > 0 && listItems[0].type === 'bullet';

      if (isBulletList) {
        return (
          <ul key={`list-${index}`} className="list-disc pl-5 space-y-1 my-4">
            {listItems.map((item, itemIndex) => 
              renderListItem(item, itemIndex, `list-${index}`)
            )}
          </ul>
        );
      } else {
        return (
          <div key={`numbered-list-${index}`} className="pl-5 space-y-1 my-4">
            {listItems.map((item, itemIndex) => 
              renderListItem(item, itemIndex, `numbered-list-${index}`)
            )}
          </div>
        );
      }
    }

    // Handle regular paragraphs
    // Split by single line breaks to handle line breaks within paragraphs
    const lines = paragraph.split(/\n/).filter(line => line.trim());

    if (lines.length === 1) {
      return <p key={`p-${index}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }} />;
    }

    return (
      <div key={`p-${index}`} >
        {lines.map((line, lineIndex) => (
          <p key={`line-${index}-${lineIndex}`} 
             className={lineIndex < lines.length - 1 ? "mb-1" : ""}
             dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line) }} 
          />
        ))}
      </div>
    );
  });
};