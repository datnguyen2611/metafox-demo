import type { LexicalEditor } from 'lexical';
import {
  AutoEmbedOption,
  EmbedConfig,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER
} from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React from 'react';
import * as ReactDOM from 'react-dom';
import useModal from '../../hooks/useModal';
import { INSERT_YOUTUBE_COMMAND } from '../YouTubePlugin';
import { INSERT_IFRAME_COMMAND } from '../IframePlugin';
import UrlForm from './EmbedCode/UrlForm';
import { useGlobal } from '@metafox/framework';
import { LineIcon } from '@metafox/ui';
interface PlaygroundEmbedConfig extends EmbedConfig {
  // Human readable name of the embeded content e.g. Tweet or Google Map.
  contentName: string;

  // Icon for display.
  icon?: JSX.Element;

  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string;

  // For extra searching.
  keywords: Array<string>;

  // Embed a Figma Project.
  description?: string;
}

export const YoutubeEmbedConfig: PlaygroundEmbedConfig = {
  contentName: 'rich_text_editor_youtube_video',

  exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',

  // Icon for display.
  icon: <LineIcon icon={'ico-youtube'} />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, result.id);
  },

  keywords: ['youtube', 'video'],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url: string) => {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match ? (match?.[2].length === 11 ? match[2] : null) : null;

    if (id != null) {
      return {
        id,
        url
      };
    }

    return null;
  },

  type: 'youtube-video'
};

export const IframeEmbedConfig: PlaygroundEmbedConfig = {
  contentName: 'rich_text_editor_embed_iframe',

  exampleUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',

  // Icon for display.
  icon: <LineIcon icon={'ico-file-code-o'} />,

  insertNode: (editor: LexicalEditor, result: EmbedMatchResult) => {
    editor.dispatchCommand(INSERT_IFRAME_COMMAND, result.url);
  },

  keywords: ['iframe', 'video'],

  // Determine if a given URL is a match and return url data.
  parseUrl: async (url: string) => {
    return { url };
  },

  type: 'iframe'
};

export const EmbedConfigs = [YoutubeEmbedConfig, IframeEmbedConfig];

function AutoEmbedMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: AutoEmbedOption;
}) {
  let className = 'item';

  if (isSelected) {
    className += ' selected';
  }

  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.title}</span>
    </li>
  );
}

function AutoEmbedMenu({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter
}: {
  selectedItemIndex: number | null;
  onOptionClick: (option: AutoEmbedOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<AutoEmbedOption>;
}) {
  return (
    <div className="typeahead-popover">
      <ul>
        {options.map((option: AutoEmbedOption, i: number) => (
          <AutoEmbedMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            key={option.key}
            option={option}
          />
        ))}
      </ul>
    </div>
  );
}

export function AutoEmbedDialog({
  embedConfig,
  onClose
}: {
  embedConfig: PlaygroundEmbedConfig;
  onClose: () => void;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const { dialogBackend, i18n } = useGlobal();

  const handleData = (parseData: EmbedMatchResult | null) => {
    if (parseData != null) {
      embedConfig.insertNode(editor, parseData);
    }
  };

  const handleSubmit = async ({ src }) => {
    const urlMatch = URL_MATCHER.exec(src);

    if (embedConfig != null && src != null && urlMatch != null) {
      const parseData = await embedConfig.parseUrl(src);

      if (parseData) {
        handleData(parseData);
        onClose();

        return;
      }
    }

    dialogBackend.alert({
      message: i18n.formatMessage({ id: 'the_url_is_invalid' })
    });
    onClose();
  };

  return <UrlForm onSubmit={handleSubmit} />;
}

export default function AutoEmbedPlugin(): JSX.Element {
  const [modal, showModal] = useModal();
  const { i18n } = useGlobal();

  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    showModal(i18n.formatMessage({ id: embedConfig.contentName }), onClose => (
      <AutoEmbedDialog embedConfig={embedConfig} onClose={onClose} />
    ));
  };

  const getMenuOptions = (
    activeEmbedConfig: PlaygroundEmbedConfig,
    embedFn: () => void,
    dismissFn: () => void
  ) => {
    return [
      new AutoEmbedOption('Dismiss', {
        onSelect: dismissFn
      }),
      new AutoEmbedOption(
        i18n.formatMessage({ id: activeEmbedConfig.contentName }),
        {
          onSelect: embedFn
        }
      )
    ];
  };

  return (
    <>
      {modal}
      <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
        embedConfigs={EmbedConfigs}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={getMenuOptions}
        menuRenderFn={(
          anchorElementRef,
          {
            selectedIndex,
            options,
            selectOptionAndCleanUp,
            setHighlightedIndex
          }
        ) =>
          (anchorElementRef.current
            ? ReactDOM.createPortal(
                <div
                  className="typeahead-popover auto-embed-menu"
                  style={{
                    marginLeft: anchorElementRef.current.style.width,
                    width: 200
                  }}
                >
                  <AutoEmbedMenu
                    options={options}
                    selectedItemIndex={selectedIndex}
                    onOptionClick={(option: AutoEmbedOption, index: number) => {
                      setHighlightedIndex(index);
                      selectOptionAndCleanUp(option);
                    }}
                    onOptionMouseEnter={(index: number) => {
                      setHighlightedIndex(index);
                    }}
                  />
                </div>,
                anchorElementRef.current
              )
            : null)
        }
      />
    </>
  );
}
