/**
 * @type: dialog
 * name: dialog.chat.PresentReactionsList
 */

import { Dialog, DialogTitle } from '@metafox/dialog';
import { useGlobal } from '@metafox/framework';
import { ScrollProvider } from '@metafox/layout';
import { useReactions } from '@metafox/reaction/hooks';
import { Tab, Tabs, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { isEmpty, isString } from 'lodash';
import React, { useRef, useState } from 'react';
import ListItemUserReaction from './ListItemUserReaction';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {},
      dialogContent: {
        height: 320,
        padding: theme.spacing(0),
        flex: '1 1 auto',
        overflowY: 'auto'
      },
      reactNumber: {
        marginBottom: '0 !important',
        color: theme.palette.text.secondary,
        fontSize: theme.mixins.pxToRem(13),
        fontWeight: theme.typography.fontWeightBold,
        '&:first-of-type': {
          fontWeight: 'normal'
        }
      },
      customTabs: {
        '& .MuiTabs-flexContainer': {
          margin: theme.spacing(1, 2, 1, 2)
        },
        '& .MuiTab-root': {
          fontSize: theme.typography.pxToRem(13),
          minHeight: 'auto',
          borderRadius: theme.shape.borderRadius / 2,
          marginRight: '0.25em',
          padding: theme.spacing(0.5, 1.5),
          '&:hover': {
            backgroundColor: theme.palette.action.hover
          }
        },
        '& .Mui-selected': {
          backgroundColor: theme.palette.action.selected
        },
        '& .MuiTab-wrapper': {
          textTransform: 'none',
          flexDirection: 'row',
          padding: theme.spacing(0.25, 1),
          '& img': {
            marginBottom: '0 !important',
            marginRight: theme.spacing(0.75),
            '& + $reactNumber': {
              fontWeight: 'bold'
            }
          }
        },
        '& .MuiTabs-indicator': {
          backgroundColor: 'transparent'
        }
      }
    }),
  { name: 'ReactionDialog' }
);

const tabsStyle = {
  minHeight: 32
};

const tabStyle = {
  minWidth: 16
};

const iconStyle = {
  width: 15,
  height: 15
};

const useCustomTabs = (items: any[]) => {
  const { i18n } = useGlobal();
  const reactions = useReactions();

  if (!items && !items?.length) return {};

  try {
    const mapReactToData = (id: string): any => {
      const idReaction = isString(id) && id.split(':')[1].split('_')[1];

      if (!idReaction || !reactions) return {};

      return reactions.find(item => item.id === parseInt(idReaction));
    };

    let usernamesAll = [];
    const total = Object.keys(items).reduce((total, key) => {
      const itemReact = mapReactToData(key);
      const usernames = items[key].map(item => {
        return {
          username: item.user_name,
          user: item,
          icon: itemReact.src,
          id: key
        };
      });
      usernamesAll = usernamesAll.concat(...usernames);

      return total + items[key]?.length;
    }, 0);

    const tabs = {
      all: {
        id: 'all',
        title: i18n.formatMessage({ id: 'all' }),
        total_reacted: total,
        usernames: usernamesAll
      }
    };

    Object.keys(items).map(reaction => {
      const itemReact = mapReactToData(reaction);

      const usernames = items[reaction].map(item => {
        return {
          username: item.user_name,
          user: item,
          icon: itemReact.src,
          id: reaction
        };
      });

      return (tabs[reaction] = {
        id: reaction,
        icon: itemReact.src,
        total_reacted: items[reaction].length,
        usernames
      });
    });

    return tabs;
  } catch (err) {
    return {};
  }
};

export default function PeopleWhoReactionThis({
  identity
}: {
  identity: string;
}) {
  const classes = useStyles();
  const defaultTab = 'all';
  const [value, setValue] = useState<string>(defaultTab);
  const scrollRef = useRef();
  const { useDialog, i18n, dispatch, useGetItem } = useGlobal();
  const { dialogProps, closeDialog } = useDialog();
  const itemMessage = useGetItem(identity);

  const unsetReaction = React.useCallback(
    (shortcut: string) => {
      dispatch({
        type: 'chat/unsetReaction',
        payload: { identity, shortcut },
        meta: {
          onSuccess: handleSuccess
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [identity]
  );
  const tabs: any = useCustomTabs(itemMessage?.reactions);

  React.useEffect(() => {
    if (!itemMessage || isEmpty(itemMessage?.reactions) || isEmpty(tabs)) {
      closeDialog();
    }
  }, [itemMessage, itemMessage?.reactions, tabs, closeDialog]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  const handleSuccess = () => {
    if (value) setValue(defaultTab);
  };

  return (
    <Dialog {...dialogProps} maxWidth="xs" fullWidth>
      <DialogTitle>{i18n.formatMessage({ id: 'reacted_by' })}</DialogTitle>
      <Tabs
        value={value}
        onChange={handleChange}
        style={tabsStyle}
        className={classes.customTabs}
      >
        {Object.values(tabs).map((tab: any) => (
          <Tab
            key={tab.id}
            style={tabStyle}
            disableRipple
            icon={
              tab.icon ? (
                <img src={tab.icon} alt={tab.id} style={iconStyle} />
              ) : (
                <span className={classes.reactNumber}>{tab.title}</span>
              )
            }
            iconPosition="start"
            label={
              tab.total_reacted ? (
                <span className={classes.reactNumber}>{tab.total_reacted}</span>
              ) : undefined
            }
            value={tab.id}
            aria-label={tab.id}
          />
        ))}
      </Tabs>
      <div className={classes.dialogContent} ref={scrollRef}>
        <ScrollProvider scrollRef={scrollRef}>
          <ListItemUserReaction
            data={tabs[value]}
            unsetReaction={unsetReaction}
          />
        </ScrollProvider>
      </div>
    </Dialog>
  );
}
