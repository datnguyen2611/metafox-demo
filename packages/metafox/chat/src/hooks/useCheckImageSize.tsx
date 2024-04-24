import { useGlobal, BasicFileItem } from '@metafox/framework';
import React from 'react';
import { isEmpty } from 'lodash';
import {
  shortenFileName,
  parseFileSize,
  checkFileAccept
} from '@metafox/utils';
type Props = {
  initialValues?: BasicFileItem[];
  messageAcceptFail?: string;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
};

export default function useCheckImageSize({
  initialValues,
  messageAcceptFail,
  inputRef
}: Props) {
  const { dialogBackend, i18n, getSetting } = useGlobal();
  const [validFileItems, setValidFileItems] = React.useState<BasicFileItem[]>(
    initialValues || []
  );

  const maxSize: any = getSetting(
    'core.attachment.maximum_file_size_each_attachment_can_be_uploaded'
  );

  const handleFiles = (files: any, previewRef?: any) => {
    const newItems = [];

    if (isEmpty(files)) return;

    const fileLimitItems = [];

    for (let index = 0; index < files.length; ++index) {
      const file = files[index];
      const fileSize = file.size;
      const fileItem: BasicFileItem = {
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file
      };

      if (!checkFileAccept(file?.type, 'image/*')) {
        dialogBackend.alert({
          message:
            messageAcceptFail ||
            i18n.formatMessage({ id: 'file_accept_type_fail' })
        });

        if (inputRef?.current) {
          inputRef.current.value = null;
        }

        break;
      }

      if (fileSize > maxSize && maxSize !== 0) {
        fileItem.max_size = maxSize;
        fileLimitItems.push(fileItem);
      } else {
        newItems.push(fileItem.file);
      }
    }

    if (newItems.length) {
      setValidFileItems([...(validFileItems || []), ...newItems]);
    }

    if (fileLimitItems.length > 0) {
      dialogBackend.alert({
        message:
          fileLimitItems.length === 1
            ? i18n.formatMessage(
                { id: 'warning_upload_limit_one_file' },
                {
                  fileName: shortenFileName(fileLimitItems[0].file_name, 30),
                  fileSize: parseFileSize(fileLimitItems[0].file_size),
                  maxSize: parseFileSize(fileLimitItems[0]?.max_size)
                }
              )
            : i18n.formatMessage(
                { id: 'warning_upload_limit_multi_image' },
                {
                  numberFile: fileLimitItems.length,
                  photoMaxSize: parseFileSize(maxSize)
                }
              )
      });

      if (inputRef?.current) {
        inputRef.current.value = null;
      }

      return 'maxLimit';
    }

    if (inputRef?.current) {
      inputRef.current.value = null;
    }
  };

  return [validFileItems, setValidFileItems, handleFiles] as const;
}
