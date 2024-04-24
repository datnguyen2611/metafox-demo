import { useGlobal } from '@metafox/framework';
import { FeedStatistic } from '@metafox/ui';
import { styled, Box } from '@mui/material';
import clsx from 'clsx';
import * as React from 'react';
import { ItemDetailInteractionProps } from '../../types';
import useStyles from './ItemDetailInteraction.styles';
import CommentList from '@metafox/core/components/CommentList';

const name = 'ItemDetailInteraction';
const StatisticWrapper = styled('div', {
  name,
  slot: 'root',
  shouldForwardProp: prop => prop !== 'isStatistic' && prop !== 'isOpenComposer'
})<{
  isStatistic?: boolean;
  isOpenComposer?: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
}>(({ theme, isStatistic, isOpenComposer, borderBottom, borderTop }) => ({
  display: 'flex',
  alignItems: 'center',

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column-reverse'
  },
  ...(isStatistic &&
    borderTop && {
      borderTop: 'solid 1px',
      borderTopColor: theme.palette.border?.secondary
    }),
  ...(isOpenComposer || borderBottom
    ? {
        borderBottom: 'solid 1px',
        borderBottomColor: theme.palette.border?.secondary
      }
    : {})
}));

export default function ItemDetailInteraction({
  identity,
  className,
  state,
  handleAction,
  extra,
  most_reactions,
  like_phrase,
  statistic,
  user_reacted,
  related_comments,
  hideComposerInListComment = false,
  messageCommentStatistic,
  borderTop = true,
  borderBottom = false,
  forceHideCommentList = false,
  forceHideReactionGroup = false,
  dataSourceCommentStatistic,
  handleActionCommentStatistic
}: ItemDetailInteractionProps) {
  const {
    jsxBackend,
    CommentActButton,
    ShareActButton,
    ReactionActButton,
    CommentReaction,
    useSession,
    useIsMobile
  } = useGlobal();
  const session = useSession();
  const classes = useStyles();
  const isMobile = useIsMobile();

  const isStatistic =
    extra?.can_like ||
    extra?.can_comment ||
    extra?.can_share ||
    statistic?.total_like ||
    statistic?.total_comment ||
    statistic?.total_share;

  if (!identity) return null;

  const CommentComposer = jsxBackend.get('CommentComposer');

  const viewMoreComments = (payload, meta) =>
    handleAction('comment/viewMoreComments', payload, meta);

  const handleLayoutWithAction = (type?: string, payload?: unknown) => {
    handleAction(type, payload);
  };

  // will check condition on future
  const showCommentList = true;

  const handleClickComposer: React.MouseEventHandler<HTMLDivElement> = e => {
    handleLayoutWithAction('onPressedCommentActButton');

    !showCommentList && e.stopPropagation();
  };

  return (
    <div className={clsx(classes.listingComment, className)}>
      <StatisticWrapper
        isStatistic={isStatistic}
        borderBottom={borderBottom}
        borderTop={borderTop}
        isOpenComposer={
          state.commentOpened &&
          !hideComposerInListComment &&
          !forceHideCommentList
        }
      >
        {session.loggedIn && !forceHideReactionGroup && CommentReaction ? (
          <div className={classes.reactionWrapper}>
            <CommentReaction>
              {extra?.can_like && ReactionActButton ? (
                <ReactionActButton
                  onlyIcon={!isMobile}
                  reacted={user_reacted}
                  identity={identity}
                  handleAction={handleAction}
                />
              ) : null}
              {extra?.can_comment && CommentActButton ? (
                <CommentActButton
                  onlyIcon={!isMobile}
                  identity={identity}
                  handleAction={handleLayoutWithAction}
                />
              ) : null}
              {extra?.can_share && ShareActButton ? (
                <ShareActButton
                  handleAction={handleAction}
                  identity={identity}
                  onlyIcon={!isMobile}
                />
              ) : null}
            </CommentReaction>
          </div>
        ) : null}
        {statistic?.total_comment > 0 ||
        statistic?.total_like > 0 ||
        statistic?.total_share > 0 ? (
          <div className={classes.feedStatisticWrapper}>
            <FeedStatistic
              handleAction={handleLayoutWithAction}
              identity={identity}
              reactions={most_reactions}
              message={like_phrase}
              statistic={statistic}
              sizeIcon={isMobile ? 'md' : 'sm'}
              messageCommentStatistic={messageCommentStatistic}
              dataSourceCommentStatistic={dataSourceCommentStatistic}
              handleActionCommentStatistic={handleActionCommentStatistic}
            />
          </div>
        ) : null}
      </StatisticWrapper>
      {CommentList && showCommentList && !forceHideCommentList ? (
        <CommentList
          data={related_comments}
          total_comment={statistic?.total_comment}
          total_reply={statistic?.total_reply}
          viewMoreComments={viewMoreComments}
          handleAction={handleAction}
          identity={identity}
          open={state.commentOpened}
          isDetailPage
        />
      ) : null}
      {session.loggedIn &&
      extra?.can_comment &&
      CommentComposer &&
      state.commentOpened &&
      !hideComposerInListComment ? (
        <Box
          pt={2}
          onClickCapture={
            state.commentOpened &&
            !hideComposerInListComment &&
            handleClickComposer
          }
        >
          <CommentComposer
            identity={identity}
            open={state.commentOpened && !hideComposerInListComment}
            focus={state?.commentFocused}
            margin="none"
          />
        </Box>
      ) : null}
    </div>
  );
}
