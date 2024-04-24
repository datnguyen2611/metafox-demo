/**
 * @type: block
 * name: core.block.footer
 * title: Footer Menu
 * keywords: general
 * description: Display footer menu include privacy, terms of use, ....
 * chunkName: block.home
 */

import { createBlock, Link, useGlobal } from '@metafox/framework';
import { styled, Typography } from '@mui/material';
import React from 'react';
import { Block, BlockContent } from '@metafox/layout';
import { filterShowWhen } from '@metafox/utils';

type FooterMenuProps = {
  color?:
    | 'inherit'
    | 'initial'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error';
  [key: string]: any;
};

const name = 'Footer';

const Content = styled('div', {
  name: 'LayoutSlot',
  slot: 'ContentLogin',
  shouldForwardProp: prop => prop !== 'isSideSlot',
  overridesResolver(props, styles) {
    return [styles.contentLogin];
  }
})<{ isSideSlot: boolean }>(({ theme, isSideSlot }) => ({
  display: isSideSlot ? 'block' : 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  lineHeight: isSideSlot ? '1.5' : 'unset',
  color: isSideSlot
    ? theme.palette.text.hint
    : theme.palette.default.contrastText
}));

const LeftMenu = styled('ul', {
  name,
  slot: 'itemFooter',
  shouldForwardProp: prop => prop !== 'isSideSlot',
  overridesResolver(props, styles) {
    return [styles.itemFooter];
  }
})<{
  isSideSlot: boolean;
}>(({ theme, isSideSlot }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: isSideSlot ? 'inline' : 'block',
  '& > li': {
    display: 'inline-block',
    paddingRight: isSideSlot ? theme.spacing(2) : theme.spacing(3)
  }
}));

const RightMenu = styled('div', {
  name,
  slot: 'itemFooter',
  shouldForwardProp: prop => prop !== 'isSideSlot',
  overridesResolver(props, styles) {
    return [styles.itemFooter];
  }
})<{
  isSideSlot: boolean;
}>(({ theme, isSideSlot }) => ({
  display: isSideSlot ? 'inline' : 'block',
  '& > span': {
    display: 'inline-block',
    '&:not(:last-child)': {
      paddingRight: isSideSlot ? theme.spacing(2) : theme.spacing(3)
    }
  }
}));

function FooterMenu({ color = 'inherit', slotName }: FooterMenuProps) {
  const { useAppMenu, getSetting, getAcl, useSession, usePageParams } =
    useGlobal();
  const params = usePageParams();
  const session = useSession();
  const acl = getAcl();
  const setting = getSetting();

  const leftFooterMenu = useAppMenu('core', 'leftFooterMenu');
  const rightFooterMenu = useAppMenu('core', 'rightFooterMenu');

  const menuItemsLeft = filterShowWhen(leftFooterMenu?.items, {
    acl,
    setting,
    session,
    params
  });

  const menuItemsRight = filterShowWhen(rightFooterMenu?.items, {
    acl,
    setting,
    session,
    params
  });

  const copyright = setting?.core?.general?.site_copyright;

  const isSideSlot = slotName === 'subside';

  if (!menuItemsLeft && !menuItemsRight) return null;

  return (
    <Block>
      <BlockContent>
        <Content isSideSlot={isSideSlot}>
          <LeftMenu isSideSlot={isSideSlot}>
            {menuItemsLeft
              ? menuItemsLeft.map((item, index) => (
                  <li key={index.toString()}>
                    <Link color={color} to={item.to} key={item.to}>
                      {item.label}
                    </Link>
                  </li>
                ))
              : null}
          </LeftMenu>
          <RightMenu isSideSlot={isSideSlot}>
            {menuItemsRight
              ? // eslint-disable-next-line no-confusing-arrow
                menuItemsRight.map((item, index) =>
                  item.name === 'copyright' ? (
                    <Typography
                      component="span"
                      fontSize="inherit"
                      color={color}
                      key={`k${index}`}
                    >
                      {`${copyright} ${new Date().getFullYear()}`}
                    </Typography>
                  ) : (
                    <span key={`k${index}`}>
                      <Link color={color} to={item.to} key={item.to}>
                        {item.label}
                      </Link>
                    </span>
                  )
                )
              : null}
          </RightMenu>
        </Content>
      </BlockContent>
    </Block>
  );
}

export default createBlock({
  extendBlock: FooterMenu,
  defaults: {
    title: 'Footer Menu',
    blockLayout: 'footer - login'
  },
  overrides: {
    noHeader: true
  }
});
