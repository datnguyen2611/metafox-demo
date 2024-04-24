import { FormBuilder, FormSchemaShape } from '@metafox/form';
import { Box, Divider } from '@mui/material';
import { set } from 'lodash';
import React from 'react';

function transformElement(name: string, value: any[]) {
  if (value[0] === false || value[0] === true) {
    return {
      component: 'Checkbox',
      label: name,
      fullWidth: true,
      name,
      size: 'small'
    };
  }

  return {
    component: 'Select',
    label: name,
    fullWidth: true,
    name,
    size: 'small',
    options: value.map(x => ({ label: x, value: x }))
  };
}

function transformPropForm(map: Record<string, any[]>): FormSchemaShape {
  const formSchema: FormSchemaShape = {
    component: 'Form',
    variant: 'horizontal',
    elements: {},
    value: {}
  };

  Object.keys(map).forEach(name => {
    const element = transformElement(name, map[name]);

    set(formSchema.value, name, map[name][0]);
    formSchema.elements[name] = element;
  });

  return formSchema;
}

export default function PropsForm({ config, children }) {
  const formSchema = React.useMemo(() => {
    return transformPropForm(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = React.useState<Record<string, any>>(
    formSchema.value
  );

  const handleUpdate = React.useCallback(({ values }) => {
    setValue(values);
  }, []);

  return (
    <Box>
      <FormBuilder formSchema={formSchema} onUpdate={handleUpdate} />
      <Divider />
      <Box marginY={2}>{children(value)}</Box>
    </Box>
  );
}
