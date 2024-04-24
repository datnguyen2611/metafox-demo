import {
  BasicFileItem,
  StatusComposerRef,
  useGlobal
} from '@metafox/framework';
import { get } from 'lodash';
import React from 'react';
import useHandleFeedMediaFile from './useHandleFeedMediaFile';

export default function useAddPhotoToStatusComposerHandler(
  composerRef: React.MutableRefObject<StatusComposerRef>,
  inputRef?: React.MutableRefObject<HTMLInputElement>,
  extra?: Record<string, any>
): [(value) => void, () => void] {
  const { dialogBackend, i18n } = useGlobal();
  const [handleFile] = useHandleFeedMediaFile({
    parentUser: extra?.parentUser
  });

  const onClick = React.useCallback(() => {
    inputRef?.current?.click();
  }, [inputRef]);

  const clear = () => {
    if (inputRef?.current) {
      inputRef.current.value = null;
    }
  };

  const handleChange = React.useCallback(
    async files => {
      if (!files.length) return;

      const filesCurrent: BasicFileItem[] = get(
        composerRef.current.state,
        'attachments.photo.value'
      );

      const { setAttachments, requestComposerUpdate } = composerRef.current;

      if (!setAttachments) return;

      handleFile(files, filesCurrent, value => {
        setAttachments('photo', 'photo', {
          as: 'StatusComposerControlAttachedPhotos',
          value
        });
      });
      clear();

      if (requestComposerUpdate) {
        setImmediate(() => {
          requestComposerUpdate();
        });
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [composerRef, dialogBackend, i18n]
  );

  const handleBeforeChange = value => {
    const files = inputRef?.current?.files || value;

    handleChange(files);
  };

  return [handleBeforeChange, onClick];
}
