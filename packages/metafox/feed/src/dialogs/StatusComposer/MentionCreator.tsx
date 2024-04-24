/**
 * @type: ui
 * name: statusComposer.plugin.mention
 * lazy: false
 */
import createMentionPlugin from '@draft-js-plugins/mention';
import { useGlobal, useResourceAction } from '@metafox/framework';
import { compactData, getImageSrc } from '@metafox/utils';
import React from 'react';
import MentionSuggestionEntry from './MentionSuggestionEntry';
import { debounce } from 'lodash';

const MAX_DISPLAY = 5;
const APP_FRIEND = 'friend';

function Suggestion({ As, parentUser, configMention, userId }) {
  const { apiClient } = useGlobal();
  const [open, setOpen] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState([]);
  const configDefault = useResourceAction(
    APP_FRIEND,
    APP_FRIEND,
    'getForMention'
  );
  const config = configMention || configDefault;
  const onOpenChange = React.useCallback((openValue: boolean) => {
    setOpen(openValue);
  }, []);
  const ownerId = parentUser ? parentUser?.id : undefined;
  const onSearchChange = React.useCallback(
    ({ value }: { value: string }) => {
      if (!config?.apiUrl || !config?.apiMethod) return;

      apiClient
        .request({
          method: config.apiMethod,
          url: config.apiUrl,
          params: compactData(config.apiParams, {
            q: value || undefined,
            owner_id: ownerId,
            user_id: userId,
            limit: 10
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
    [config, userId, ownerId]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = React.useCallback(debounce(onSearchChange, 500), [
    onSearchChange
  ]);

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

export default function mentionCreator(plugins: any[], components: any[]) {
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
      key: 'mention'
    }
  });
}
