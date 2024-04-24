/**
 * @type: ui
 * name: story-book.sample.popup
 */

import { RouteLink } from '@metafox/framework';
import GroupCard from '@metafox/group/components/ProfilePopup/index';
import PageCard from '@metafox/pages/components/ProfilePopup/index';
import UserCard from '@metafox/user/components/ProfilePopup/index';
import React from 'react';
import PropForm from './PropsForm';

export default function SamplePopup() {
  const userRef = React.useRef();
  const pageRef = React.useRef();
  const groupRef = React.useRef();

  return (
    <PropForm
      config={{
        type: ['page', 'user', 'group']
      }}
    >
      {({ type }) => (
        <div>
          <div style={{ padding: 15 }}>
            <RouteLink to="/user/2" ref={userRef}>
              to user
            </RouteLink>
            <UserCard
              id={2}
              open={type === 'user'}
              anchorEl={userRef.current}
            />
          </div>
          <div style={{ padding: 15 }}>
            <RouteLink to="/page/15" ref={pageRef}>
              to page
            </RouteLink>
            <PageCard
              id={15}
              open={type === 'page'}
              anchorEl={pageRef.current}
            />
          </div>
          <div style={{ padding: 15 }}>
            <RouteLink to="/group/83" ref={groupRef}>
              to group
            </RouteLink>
            <GroupCard
              id={83}
              open={type === 'group'}
              anchorEl={groupRef.current}
            />
          </div>
        </div>
      )}
    </PropForm>
  );
}
