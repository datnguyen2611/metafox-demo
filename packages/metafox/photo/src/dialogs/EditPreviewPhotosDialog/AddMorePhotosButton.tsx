import { useGlobal } from '@metafox/framework';
import { LineIcon } from '@metafox/ui';
import { Button } from '@mui/material';
import React from 'react';
import useHandleFeedMediaFile from '@metafox/photo/hooks/useHandleFeedMediaFile';
import useFeedMediaConfig from '@metafox/photo/hooks/useFeedMediaConfig';
type Props = {
  setItems: any;
  variant: 'default' | 'listing';
  totalCurrent?: number;
  limit?: number;
  items: Record<string, any>[];
  parentUser: Record<string, any>;
};
export default function AddMorePhotoButtons({
  variant,
  setItems,
  items,
  parentUser
}: Props) {
  const { i18n } = useGlobal();
  const inputRef = React.useRef<HTMLInputElement>();
  const [handleFile] = useHandleFeedMediaFile({
    parentUser
  });
  const { acceptTypes } = useFeedMediaConfig({
    parentUser
  });

  const onClick = React.useCallback(() => {
    inputRef?.current?.click();
  }, [inputRef]);

  const clear = () => {
    if (inputRef?.current) {
      inputRef.current.value = null;
    }
  };

  const handleChange = () => {
    const files = inputRef?.current?.files;

    handleFile(files, items, values => {
      setItems(values);
    });
    clear();
  };

  return (
    <>
      {variant === 'listing' ? (
        <Button
          color="primary"
          onClick={onClick}
          startIcon={<LineIcon icon="ico-photos-plus-o" />}
          variant="outlined"
        >
          {i18n.formatMessage({ id: 'add_photos' })}
        </Button>
      ) : (
        <Button
          color="primary"
          onClick={onClick}
          variant="outlined"
          startIcon={<LineIcon icon="ico-plus" />}
        >
          {i18n.formatMessage({ id: 'add_photos' })}
        </Button>
      )}
      <input
        onChange={handleChange}
        multiple
        ref={inputRef}
        className="srOnly"
        type="file"
        accept={acceptTypes}
      />
    </>
  );
}
