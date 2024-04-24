import {
  BlockViewProps,
  useGlobal,
  useResourceAction,
  useResourceForm
} from '@metafox/framework';
import { FormBuilder } from '@metafox/form';
import { Block, BlockContent } from '@metafox/layout';
import { whenParamRules } from '@metafox/utils';
import { isEmpty, isEqual, isNil, omitBy, debounce } from 'lodash';
import qs from 'query-string';
import React, { useState } from 'react';

export interface Props extends BlockViewProps {
  resourceNameAction?: string;
  formName?: string;
}

export default function SidebarQuickFilter({
  formName = 'search',
  resourceNameAction
}: Props) {
  const { usePageParams, compactUrl, useContentParams, navigate } = useGlobal();
  const pageParams = usePageParams();
  const contentParams = useContentParams();
  const { appName, resourceName, id } = pageParams;

  const config = useResourceAction(
    appName,
    resourceName,
    resourceNameAction || 'viewAll'
  );

  const formSchema = useResourceForm(appName, resourceName, formName);
  const [currentValue, setCurrentValue] = useState(
    isEmpty(formSchema?.value) ? {} : formSchema.value
  );

  const action = formSchema?.action;

  const onSubmit = (values, actions) => {
    actions.setSubmitting(false);
  };

  const handleSearch = React.useCallback(
    values => {
      if (
        isEqual(
          omitBy(values, v => isNil(v)),
          omitBy(currentValue, v => isNil(v))
        )
      ) {
        return;
      }

      setCurrentValue(values);

      const apiRules =
        contentParams?.mainListing?.dataSource?.apiRules || config.apiRules;

      const params = whenParamRules(values, apiRules);
      const url = compactUrl(action, { id });
      navigate(`${url}?${qs.stringify(params)}`, { replace: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentValue, setCurrentValue]
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = React.useCallback(debounce(handleSearch, 200), [
    handleSearch
  ]);

  const onChange = ({ values }: any) => {
    debounceSearch(values);
  };

  React.useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Block testid="blockSearch">
      <BlockContent>
        <FormBuilder
          noHeader
          noBreadcrumb
          formSchema={formSchema}
          onSubmit={onSubmit}
          onChange={onChange}
        />
      </BlockContent>
    </Block>
  );
}
