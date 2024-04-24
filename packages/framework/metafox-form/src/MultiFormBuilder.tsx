import { SmartFormBuilder } from '@metafox/form';
import { useGlobal } from '@metafox/framework';
import React from 'react';
import { useSelector } from 'react-redux';
import { get, isFunction } from 'lodash';

export default function MultiFormBuilder(props) {
  const { dataSource, onSuccess, onLoadedSingleStepFrom } = props || {};
  const { dispatch } = useGlobal();

  const [formName, setFormName] = React.useState('');
  const [currentForm, setCurrentForm] = React.useState('');
  const formValues = useSelector(state => get(state, `formValues.${formName}`));
  const formSchemas = useSelector(state =>
    get(state, `formSchemas.${formName}`)
  );
  const formSchemasOrigin = get(formSchemas, `${currentForm}.formSchema`);
  const formNameRef = React.useRef<any>();
  formNameRef.current = formName;
  const formSchema = formSchemasOrigin
    ? {
        ...formSchemasOrigin,
        handleBackForm: x => {
          const { payload } = x || {};
          setCurrentForm(payload?.previousProcessChildId);
        }
      }
    : undefined;

  // get data processChildId chain

  let initialValues = {};

  if (formValues && formSchemas) {
    let currentProcessChildId = currentForm;

    while (currentProcessChildId) {
      const value = formValues[currentProcessChildId];
      const form = formSchemas[currentProcessChildId];

      initialValues = { ...initialValues, ...value };

      currentProcessChildId = form?.previousProcessChildId;
    }
  }

  React.useEffect(() => {
    return () => {
      // cleanup data when exit multistep process
      if (formNameRef.current) {
        dispatch({
          type: 'formValues/onDestroy',
          payload: {
            formName: formNameRef.current
          }
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SmartFormBuilder
      {...props}
      dataSource={formSchema ? undefined : dataSource}
      formSchema={formSchema}
      initialValues={initialValues}
      onLoaded={({ data, meta }) => {
        if (!data || !meta) {
          isFunction(onLoadedSingleStepFrom) && onLoadedSingleStepFrom();

          return;
        }

        const { formName, processChildId, previousProcessChildId } =
          meta?.continueAction?.payload;
        setFormName(formName);
        setCurrentForm(processChildId);

        dispatch({
          type: 'formSchemas/multiForm/nextStep',
          payload: {
            formName,
            processChildId,
            data: {
              formSchema: { ...data, formName: processChildId },
              previousProcessChildId
            }
          }
        });
      }}
      onSuccess={(values, meta) => {
        const nextProcess = meta?.continueAction?.payload?.processChildId;

        if (nextProcess) {
          setCurrentForm(nextProcess);
        } else {
          isFunction(onSuccess) && onSuccess(values, meta);
        }
      }}
    />
  );
}
