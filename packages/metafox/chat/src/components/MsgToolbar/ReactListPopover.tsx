import { useMsgItem } from '@metafox/chat/hooks';
import { useGlobal } from '@metafox/framework';
import { useReactions } from '@metafox/reaction/hooks';
import { clsx } from '@metafox/ui/styles';
import { Theme, Tooltip } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { isEmpty } from 'lodash';
import React from 'react';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      paper: {
        borderRadius: 24,
        margin: 0,
        padding: 0
      },
      itemsRoot: {
        display: 'flex',
        flexDirection: 'row'
      },
      itemRoot: {
        padding: '4px',
        display: 'flex',
        alignItem: 'center',
        alignSelf: 'center'
      },
      itemImage: {
        width: 27,
        height: 27
      },
      active: {
        background: theme.palette.grey['300'],
        padding: theme.spacing(0.5),
        borderRadius: theme.spacing(1),
        width: 34,
        height: 34,
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center',
        margin: theme.spacing(0.2)
      }
    }),
  { name: 'ReactionThisItemPopover' }
);

const Item = ({
  item,
  classes,
  onClick,
  active
}: {
  classes: any;
  item: any;
  onClick?: any;
  active?: boolean;
}) => {
  return (
    <div
      className={clsx(classes.itemRoot, active && classes.active)}
      role="button"
      onClick={onClick}
      aria-label={item.title}
      data-testid="itemReaction"
    >
      <Tooltip title={item.title}>
        <img
          src={item.src}
          draggable={false}
          alt={item.title}
          className={classes.itemImage}
        />
      </Tooltip>
    </div>
  );
};

function ReactListPopover({ onEmojiClick, unsetReaction, identity }: any) {
  const { useSession } = useGlobal();
  const reactions = useReactions();

  const classes = useStyles();
  const message = useMsgItem(identity);
  const { user } = useSession();

  const checkReacted = (id: string) => {
    if (isEmpty(message?.reactions?.[id])) return false;

    const result = message?.reactions?.[id].some(
      item => item.user_name === user.user_name
    );

    return result;
  };

  const handleEmojiClick = id => {
    const isReacted = checkReacted(id);

    if (isReacted) {
      unsetReaction(id);
    } else {
      onEmojiClick(id, null);
    }
  };

  return (
    <div className={classes.itemsRoot}>
      {reactions.map(item => {
        return (
          <Item
            key={item.id.toString()}
            onClick={() => {
              handleEmojiClick(`:reaction_${item.id.toString()}:`);
            }}
            classes={classes}
            item={item}
            active={checkReacted(`:reaction_${item.id}:`)}
          />
        );
      })}
    </div>
  );
}

export default ReactListPopover;
