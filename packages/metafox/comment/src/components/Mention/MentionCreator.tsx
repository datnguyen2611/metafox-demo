/**
 * @type: ui
 * name: comment.plugin.mention
 * lazy: false
 */
import createMentionPlugin from '@draft-js-plugins/mention';
import { useGlobal, useResourceAction } from '@metafox/framework';
import { APP_FRIEND } from '@metafox/friend';
import { compactData, getImageSrc } from '@metafox/utils';
import React from 'react';
import MentionSuggestionEntry from './MentionSuggestionEntry';
import { debounce } from 'lodash';

const MAX_DISPLAY = 5;

function Suggestion({ As, parentUser }) {
  const { apiClient } = useGlobal();
  const [open, setOpen] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState([]);
  const config = useResourceAction(APP_FRIEND, APP_FRIEND, 'getForMention');
  const onOpenChange = React.useCallback((openValue: boolean) => {
    setOpen(openValue);
  }, []);
  const ownerId = parentUser?.id;
  const onSearchChange = React.useCallback(
    ({ value }: { value: string }) => {
      if (!config?.apiUrl || !config?.apiMethod || !config?.apiParams) return;

      apiClient
        .request({
          method: config.apiMethod,
          url: config.apiUrl,
          params: compactData(config.apiParams, {
            q: value || undefined,
            owner_id: ownerId
          })
        })
        .then(res => (res.data?.data?.length ? res.data?.data : []))
        .then(items => {
          return items.map((item, index) => {
            if (index >= MAX_DISPLAY) return false;

            return {
              avatar: getImageSrc(item.avatar),
              name: item.full_name,
              link: `@mention/${item.resource_name}/${item.id}`,
              moduleName: item?.module_name,
              statistic: item?.statistic,
              type: item?.type
            };
          });
        })
        .then(items => setSuggestions(items.filter(Boolean)));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = React.useCallback(debounce(onSearchChange, 500), []);

  return (
    <As
      open={Boolean(open && suggestions.length)}
      onOpenChange={onOpenChange}
      suggestions={suggestions}
      onSearchChange={debounceSearch}
      entryComponent={MentionSuggestionEntry}
      onAddMention={() => {
        // get the mention object selected
      }}
    />
  );
}

export default function mentionCreator(
  plugins: any[],
  components: any[],
  parentUser
) {
  const mentionPlugin = createMentionPlugin({
    supportWhitespace: true,
    theme: {
      mention: 'mentionText',
      mentionSuggestions: 'mentionSuggestionsWrapper'
    }
  });
  const { MentionSuggestions } = mentionPlugin;

  plugins.push(mentionPlugin);
  components.push({
    component: Suggestion,
    props: {
      As: MentionSuggestions,
      parentUser,
      key: 'mention'
    }
  });
}
