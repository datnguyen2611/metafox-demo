/**
 * @type: ui
 * name: FeedItemActionInteract
 */
import { useGlobal } from '@metafox/framework';
import { FeedStatistic } from '@metafox/ui';
import { styled } from '@mui/material';
import * as React from 'react';

type Props = {
  identity: string;
  item: Record<string, any>;
  user: Record<string, any>;
  handleAction: () => void;
  handleLayoutWithAction: () => void;
};

const FeedReactionRoot = styled('div', {
  name: 'FeedItem',
  slot: 'ReactionRoot',
  overridesResolver(props, styles) {
    return [styles.root];
  }
})(({ theme }) => ({
  minHeight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse'
  }
}));

const Wrapper = styled('div', {
  name: 'FeedItem',
  slot: 'ReactionRoot',
  overridesResolver(props, styles) {
    return [styles.root];
  }
})(({ theme }) => ({
  '& .MuiFeedCommentBlock-itemOuter': {
    border: 'none'
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const StatisticWrapper = styled('div', {
  name: 'FeedItem',
  slot: 'ReactionRoot',
  overridesResolver(props, styles) {
    return [styles.root];
  }
})(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    '&:not(:empty)': {
      borderBottom: 'solid 1px',
      borderBottomColor: theme.palette.border?.secondary
    }
  }
}));

const FeedItemActionInteract = ({
  identity,
  item,
  user,
  handleAction,
  handleLayoutWithAction
}: Props) => {
  const {
    CommentActButton,
    ShareActButton,
    ReactionActButton,
    CommentReaction,
    useSession,
    useIsMobile
  } = useGlobal();
  const session = useSession();

  const isMobile = useIsMobile();

  if (!item || !user) return null;

  const { statistic, most_reactions, like_phrase } = item;

  return (
    <FeedReactionRoot>
      <Wrapper>
        {CommentReaction ? (
          <CommentReaction>
            {session.loggedIn && item.extra?.can_like && ReactionActButton ? (
              <ReactionActButton
                onlyIcon={!isMobile}
                reacted={item.user_reacted}
                identity={identity}
                handleAction={handleAction}
              />
            ) : null}
            {session.loggedIn && item.extra?.can_comment && CommentActButton ? (
              <CommentActButton
                onlyIcon={!isMobile}
                identity={identity}
                handleAction={handleLayoutWithAction}
              />
            ) : null}
            {session.loggedIn && item.extra.can_share && ShareActButton ? (
              <ShareActButton
                handleAction={handleAction}
                identity={identity}
                onlyIcon={!isMobile}
              />
            ) : null}
          </CommentReaction>
        ) : null}
      </Wrapper>
      <StatisticWrapper>
        <FeedStatistic
          handleAction={handleLayoutWithAction}
          identity={identity}
          reactions={most_reactions}
          message={like_phrase}
          statistic={statistic}
        />
      </StatisticWrapper>
    </FeedReactionRoot>
  );
};

export default FeedItemActionInteract;
