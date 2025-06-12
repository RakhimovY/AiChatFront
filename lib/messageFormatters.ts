export interface ListItem {
  content: string;
  type: 'bullet' | 'numbered';
  number: number | null;
  nested: ListItem[];
}

export const formatBoldText = (text: string): string => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

export const formatCodeBlocks = (text: string): string => {
  return text.replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>');
};

export const formatMarkdownHeaders = (text: string): string => {
  return text.replace(/^(#{1,6})\s+(.*?)$/gm, (match, hashes, content) => {
    const level = hashes.length;
    return `<h${level} class="markdown-header">${content}</h${level}>`;
  });
};

export const formatBlockQuotes = (text: string): string => {
  const lines = text.split('\n');
  let inBlockquote = false;
  let result = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('>')) {
      const content = line.trim().substring(1).trim();

      if (!inBlockquote) {
        result += '<blockquote class="block-quote">';
        inBlockquote = true;
      }

      result += content + (i < lines.length - 1 ? '<br>' : '');
    } else {
      if (inBlockquote) {
        result += '</blockquote>';
        inBlockquote = false;
      }

      result += line + (i < lines.length - 1 ? '\n' : '');
    }
  }

  if (inBlockquote) {
    result += '</blockquote>';
  }

  return result;
};

export const formatLinks = (text: string): string => {
  const urlPattern = /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/g;

  return text.replace(urlPattern, (url) => {
    let displayUrl = url;
    try {
      const urlObj = new URL(url);
      displayUrl = urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '');
      if (displayUrl.length > 30) {
        displayUrl = displayUrl.substring(0, 30) + '...';
      }
    } catch (e) {
    }

    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${displayUrl}</a>`;
  });
};

export const getIndentationLevel = (line: string): number => {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
};

export const processList = (lines: string[], startIndex: number, baseIndentation: number): ListItem[] => {
  const result: ListItem[] = [];
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    const indentation = getIndentationLevel(line);

    if (indentation < baseIndentation) {
      break;
    }

    if (indentation === baseIndentation) {
      const trimmedLine = line.trim();
      const isBullet = trimmedLine.match(/^[*-]\s/);
      const isNumbered = trimmedLine.match(/^\d+\.\s/);

      if (isBullet || isNumbered) {
        let itemContent = isBullet 
          ? trimmedLine.replace(/^[*-]\s/, '') 
          : isNumbered 
            ? trimmedLine.replace(/^\d+\.\s/, '')
            : trimmedLine;

        let nestedContent = [];
        let j = i + 1;

        while (j < lines.length && getIndentationLevel(lines[j]) > baseIndentation) {
          nestedContent.push(lines[j]);
          j++;
        }

        let nestedItems: ListItem[] = [];
        if (nestedContent.length > 0) {
          const nestedIndentation = getIndentationLevel(nestedContent[0]);
          nestedItems = processList(lines, i + 1, nestedIndentation);
          i = j - 1;
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

export const applyTextFormatting = (text: string): string => {
  const textWithCodeBlocks = formatCodeBlocks(text);
  const textWithHeaders = formatMarkdownHeaders(textWithCodeBlocks);
  const textWithBlockQuotes = formatBlockQuotes(textWithHeaders);
  const textWithBoldFormatting = formatBoldText(textWithBlockQuotes);
  return formatLinks(textWithBoldFormatting);
};