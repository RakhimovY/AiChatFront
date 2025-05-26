/**
 * Message formatting utilities for chat messages
 * These functions handle various formatting tasks like bold text, code blocks, lists, etc.
 */

/**
 * Interface for list items
 */
export interface ListItem {
  content: string;
  type: 'bullet' | 'numbered';
  number: number | null;
  nested: ListItem[];
}

/**
 * Formats bold text with ** markers
 */
export const formatBoldText = (text: string): string => {
  // Replace **text** with <strong>text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

/**
 * Formats code blocks with ``` markers
 */
export const formatCodeBlocks = (text: string): string => {
  // Replace ```code``` with formatted code blocks
  return text.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
};

/**
 * Formats markdown headers
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
 */
export const getIndentationLevel = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

/**
 * Processes a list (either bulleted or numbered)
 */
export const processList = (lines: string[], startIndex: number, baseIndentation: number): ListItem[] => {
  const result: ListItem[] = [];
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
        let nestedItems: ListItem[] = [];
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
 * Applies all text formatting to the message content
 */
export const applyTextFormatting = (text: string): string => {
  // Apply code block formatting first (to avoid conflicts with other formatting)
  const textWithCodeBlocks = formatCodeBlocks(text);

  // Apply markdown headers formatting
  const textWithHeaders = formatMarkdownHeaders(textWithCodeBlocks);

  // Apply block quote formatting
  const textWithBlockQuotes = formatBlockQuotes(textWithHeaders);

  // Apply bold formatting
  const textWithBoldFormatting = formatBoldText(textWithBlockQuotes);

  // Apply link formatting
  return formatLinks(textWithBoldFormatting);
};