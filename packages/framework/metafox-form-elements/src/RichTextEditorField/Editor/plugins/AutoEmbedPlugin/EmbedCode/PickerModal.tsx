import { useGlobal } from '@metafox/framework';
import { LineIcon } from '@metafox/ui';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled
} from '@mui/material';
import React from 'react';
import UrlForm from './UrlForm';

const regexUrl =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/m;

const CloseButton = styled(IconButton, { name: 'MuiDialogClose' })(() => ({
  marginLeft: 'auto',
  transform: 'translate(4px,0)'
}));

const regexIframe = /<iframe([\w\W]+?)>/m;

const embedVideoCallBack = link => {
  if (regexIframe.test(link)) {
    const regex = /(?<=src=").*?(?=["])/g;
    const data = link.match(regex);

    if (data?.length) {
      link = data[0];
    }

    return link;
  }

  if (link.indexOf('youtube') >= 0 || link.indexOf('youtu.be/') >= 0) {
    link = link.replace('watch?v=', 'embed/');
    link = link.replace('/watch/', '/embed/');
    link = link.replace('youtu.be/', 'youtube.com/embed/');
  }

  return link;
};

function ImagePickerModal({ onExited, onChange }) {
  const [open, setOpen] = React.useState(true);
  const { i18n, dialogBackend } = useGlobal();

  const [haveData, setHaveData] = React.useState<boolean>(false);

  const onSubmit = data => {
    const validUrl = regexUrl.test(data?.src);

    if (!validUrl) {
      dialogBackend.alert({
        message: i18n.formatMessage({ id: 'the_url_is_invalid' })
      });
      onChange(null);
      setOpen(false);

      return;
    }

    onChange({ ...data, src: embedVideoCallBack(data.src) });
    setOpen(false);
  };

  const stopEvent = evt => {
    evt.stopPropagation();
  };

  const handleClose = async () => {
    if (!haveData) {
      onChange(null);
      setOpen(false);

      return;
    }

    const ok = await dialogBackend.confirm({
      message: i18n.formatMessage({
        id: 'the_change_you_made_will_not_be_saved'
      }),
      title: i18n.formatMessage({
        id: 'unsaved_changes'
      })
    });

    if (ok) {
      onChange(null);
      setOpen(false);
    }
  };

  const handleChange = ({ values }) => {
    setHaveData(Boolean(values?.src));
  };

  return (
    <Dialog
      onClick={stopEvent}
      open={open}
      maxWidth="sm"
      fullWidth
      TransitionProps={{
        onExited
      }}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      scroll="paper"
      sx={{
        '& .MuiPaper-root': {
          overflowY: 'hidden'
        },
        '& .MuiDialogContent-root': {
          overflowX: 'hidden'
        }
      }}
    >
      <DialogTitle>
        {i18n.formatMessage({ id: 'embed_link' })}
        <CloseButton
          size="small"
          onClick={handleClose}
          data-testid="buttonClose"
          role="button"
        >
          <LineIcon icon="ico-close" />
        </CloseButton>
      </DialogTitle>
      <DialogContent>
        <UrlForm onChange={handleChange} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}

export default ImagePickerModal;
