import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import useColors from '../theming/useColors';
import { InlineMath, BlockMath } from 'react-katex';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
    const colors = useColors();
    const header_text_color = colors.text.teal;
    let display_content = content;
    //console.log(display_content);
    const customStyles = {
        h1: {
            fontWeight: 'bold',
            color: header_text_color,
            fontSize: '1.5em',
            padding: '0.5em 0',
        },
        h2: {
            fontWeight: 'bold',
            color: header_text_color,
            fontSize: '1.3em',
            my: '4em',
            padding: '0.5em 0',
        },
        h3: {
            fontWeight: 'bold',
            color: header_text_color,
            fontSize: '1.2em',
            padding: '0.5em 0',
        },
        h4: {
            fontWeight: 'bold',
            color: header_text_color,
            fontSize: '1em',
            padding: '0.5em 0',
        }
    };      

    const preprocessContent = (content) => {
        // Step 1: Replace backslash-escaped brackets with special markers
        content = content.replace(/\\\[([\s\S]+?)\\\]/g, (match, p1) => {
          // Temporarily replace escaped backslashes
          let temp = p1.replace(/\\\\/g, '%%DOUBLE_BACKSLASH%%');
          // Remove single backslashes before curly braces and underscores
          temp = temp.replace(/\\([{}_])/g, '$1');
          return `%%MATH_START%%${temp}%%MATH_END%%`;
        });
           
        // Step 2: Escape all remaining dollar signs
        content = content.replace(/\$/g, '\\$');
      
        // Step 3: Replace our special markers with unescaped dollar signs, and unescape any dollar signs within
        content = content.replace(/%%MATH_START%%([\s\S]+?)%%MATH_END%%/g, (match, p1) => {
          // Restore double backslashes
          return `$${p1.replace(/%%DOUBLE_BACKSLASH%%/g, '\\\\')}$`;
        });
      
        // Step 4: Handle inline equations surrounded by \( ... \)
        content = content.replace(/\\\(([\s\S]+?)\\\)/g, (match, p1) => {
          return `$${p1}$`;
        });
      
        return content;
      };
      
      
      const preprocessedContent = preprocessContent(display_content);
    
    //console.log('Preprocessed Content:', preprocessedContent);

    const renderers = {
        h1: ({ node, ...props }) => <h1 style={customStyles.h1} {...props} />,
        h2: ({ node, ...props }) => <h2 style={customStyles.h2} {...props} />,
        h3: ({ node, ...props }) => <h3 style={customStyles.h3} {...props} />,
        h4: ({ node, ...props }) => <h4 style={customStyles.h4} {...props} />,
        ol: ({ node, ...props }) => <ol style={{ paddingLeft: '30px' }} {...props} />,
        ul: ({ node, ...props }) => <ul style={{ paddingLeft: '30px' }} {...props} />,
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ padding: '1em', borderRadius: '5px', maxWidth: window.screen.width * 0.8}}
                    wrapLongLines={true}
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
        inlineMath: ({ value }) => <InlineMath math={value} />,
        math: ({ value }) => <BlockMath math={value} />,
    };

    return (
        <ReactMarkdown
            components={renderers}
            children={preprocessedContent}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
        />
    );
};

export default MarkdownRenderer;
