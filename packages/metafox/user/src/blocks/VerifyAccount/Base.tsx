import { BlockViewProps, useGlobal } from '@metafox/framework';
import { MultiFormBuilder } from '@metafox/form';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import React from 'react';
import useStyles from './styles';

export interface Props extends BlockViewProps {
  initialValues: any;
}

export default function Base({ title, initialValues, blockProps }: Props) {
  const { dispatch, useContentParams, usePageParams, navigate } = useGlobal();
  const classes = useStyles();
  const { mainForm } = useContentParams();
  const pageParams = usePageParams();

  // Update redux store.
  const onChange = React.useCallback(
    (data: Record<string, any>) => {
      if (!mainForm.formName) return;

      dispatch({
        type: 'formValues/onChange',
        payload: {
          formName: mainForm.formName,
          data
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!mainForm?.dataSource && !mainForm.formSchema) {
    return null;
  }

  const onSuccess = (value, meta) => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const {
    dataSource,
    noHeader,
    noBreadcrumb,
    formSchema,
    breadcrumbs,
    minHeight,
    disableFormOnSuccess
  } = mainForm;

  return (
    <Block testid="mainForm">
      <BlockHeader title={title} />
      <BlockContent style={{ minHeight }}>
        <div className={classes.formWrapper}>
          <MultiFormBuilder
            onSuccess={onSuccess}
            noHeader={noHeader}
            breadcrumbs={breadcrumbs}
            noBreadcrumb={noBreadcrumb}
            formSchema={formSchema}
            pageParams={pageParams}
            dataSource={dataSource}
            onChange={onChange}
            initialValues={initialValues}
            changeEventName={mainForm.changeEventName}
            disableFormOnSuccess={disableFormOnSuccess}
          />
        </div>
      </BlockContent>
    </Block>
  );
}
