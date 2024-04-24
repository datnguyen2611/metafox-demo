import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread
} from 'lexical';
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents';
import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode
} from '@lexical/react/LexicalDecoratorBlockNode';
import * as React from 'react';

type IframeComponentProps = Readonly<{
  className: Readonly<{
    base: string;
    focus: string;
  }>;
  format: ElementFormatType | null;
  nodeKey: NodeKey;
  url: string;
}>;

function IframeComponent({
  className,
  format,
  nodeKey,
  url
}: IframeComponentProps) {
  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <iframe
        width="560"
        height="315"
        src={url}
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        title="iframe embed"
      />
    </BlockWithAlignableContents>
  );
}

export type SerializedIframeNode = Spread<
  {
    url: string;
  },
  SerializedDecoratorBlockNode
>;

function convertIframeElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  const url = domNode.getAttribute('data-lexical-iframe');

  if (url) {
    const node = $createIframeNode(url);

    return { node };
  }

  return null;
}

export class IframeNode extends DecoratorBlockNode {
  __url: string;

  static getType(): string {
    return 'iframe';
  }

  static clone(node: IframeNode): IframeNode {
    return new IframeNode(node.__url, node.__format, node.__key);
  }

  static importJSON(serializedNode: SerializedIframeNode): IframeNode {
    const node = $createIframeNode(serializedNode.url);
    node.setFormat(serializedNode.format);

    return node;
  }

  exportJSON(): SerializedIframeNode {
    return {
      ...super.exportJSON(),
      type: 'iframe',
      version: 1,
      url: this.__url
    };
  }

  constructor(id: string, format?: ElementFormatType, key?: NodeKey) {
    super(format, key);
    this.__url = id;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe');
    element.setAttribute('data-lexical-iframe', this.__url);
    element.setAttribute('width', '560');
    element.setAttribute('height', '315');
    element.setAttribute(
      'src',
      this.__url
    );
    element.setAttribute('frameborder', '0');
    element.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    );
    element.setAttribute('allowfullscreen', 'true');
    element.setAttribute('title', 'YouTube video');

    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      iframe: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-iframe')) {
          return null;
        }

        return {
          conversion: convertIframeElement,
          priority: 1
        };
      }
    };
  }

  updateDOM(): false {
    return false;
  }

  getId(): string {
    return this.__url;
  }

  getTextContent(
    _includeInert?: boolean | undefined,
    _includeDirectionless?: false | undefined
  ): string {
    return this.__url;
  }

  decorate(_editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {};
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || ''
    };

    return (
      <IframeComponent
        className={className}
        format={this.__format}
        nodeKey={this.getKey()}
        url={this.__url}
      />
    );
  }
}

export function $createIframeNode(url: string): IframeNode {
  return new IframeNode(url);
}

export function $isIframeNode(
  node: IframeNode | LexicalNode | null | undefined
): node is IframeNode {
  return node instanceof IframeNode;
}
