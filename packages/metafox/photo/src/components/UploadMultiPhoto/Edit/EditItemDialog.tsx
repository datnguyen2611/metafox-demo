/**
 * @type: dialog
 * name: photo.dialog.quickEditPhotoFieldItem
 */

import { useGlobal, useResourceForm } from '@metafox/framework';
import { Dialog } from '@metafox/dialog';
import { FormBuilder } from '@metafox/form';
import React from 'react';
import { APP_PHOTO, RESOURCE_PHOTO } from '@metafox/photo';

export default function FormDialog({
  initialValues,
  formSchema: formSchemaProp,
  formName = 'edit_selecting_photo'
}) {
  const { useDialog } = useGlobal();
  const dialogItem = useDialog();
  const { dialogProps, setDialogValue } = dialogItem;
  const formSchema = useResourceForm(APP_PHOTO, RESOURCE_PHOTO, formName);
  const handleSubmit = React.useCallback(
    values => {
      setDialogValue(values);
    },
    [setDialogValue]
  );

  if (!formSchema) return null;

  return (
    <Dialog {...dialogProps} maxWidth="sm" fullWidth>
      <FormBuilder
        initialValues={initialValues}
        dialog
        dialogItem={dialogItem}
        formSchema={formSchemaProp || formSchema}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
}
