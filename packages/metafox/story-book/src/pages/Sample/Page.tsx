/**
 * @type: route
 * name: story-book.sample
 * path: /story-book/sample/:tab?
 * chunkName: pages.storybook
 * bundle: web
 */
import { useGlobal } from '@metafox/framework';
import { Page } from '@metafox/layout';
import React from 'react';

export default function HomePage(props) {
  const { createPageParams } = useGlobal();

  const pageParams = createPageParams(props);

  return <Page pageName={'story-book.sample'} pageParams={pageParams} />;
}
