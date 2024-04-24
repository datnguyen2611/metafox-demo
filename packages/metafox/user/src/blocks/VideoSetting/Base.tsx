import {
  BlockViewProps,
  useGlobal,
  RemoteDataSource
} from '@metafox/framework';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import * as React from 'react';
import { RemoteFormBuilder } from '@metafox/form';

export type Props = BlockViewProps & {
  dataSource?: RemoteDataSource;
};

export default function GroupInfo({ dataSource, title }: Props) {
  const { i18n } = useGlobal();

  return (
    <Block>
      <BlockHeader title={i18n.formatMessage({ id: title || 'settings' })} />
      <BlockContent>
        <RemoteFormBuilder
          dataSource={dataSource}
          resetFormWhenSuccess={{ keepValues: true }}
        />
      </BlockContent>
    </Block>
  );
}
