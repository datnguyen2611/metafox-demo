import { useGlobal } from '@metafox/framework';
import { StyledIconButton } from '@metafox/ui';
import { getImageSrc, isVideoType } from '@metafox/utils';
import { TextField, Box } from '@mui/material';
import clsx from 'clsx';
import { XYCoord } from 'dnd-core';
import React from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

export default function ItemPhoto({
  id,
  index,
  item,
  movePhoto,
  editItem,
  editPhoto,
  removeItem,
  tagItem,
  editTextPhoto,
  classes,
  hideRemove
}) {
  const { i18n, useSession, ParserPreviewPhoto } = useGlobal();
  const itemRef = React.useRef<HTMLDivElement>(null);
  const { user } = useSession();
  const defaultPhotoCaption = React.useMemo(
    () => item?.text ?? '',
    [item?.text]
  );
  const [photoCaption, setPhotoCaption] = React.useState(defaultPhotoCaption);
  const [isParsingFile, setIsParsingFile] = React.useState(false);
  const [, drop] = useDrop({
    accept: ItemTypes.PHOTO,
    hover(item, monitor: DropTargetMonitor) {
      if (!itemRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = itemRef.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      movePhoto(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const handleChangeCaption = event => {
    const data = event.target.value;
    setPhotoCaption(data);
  };

  React.useEffect(() => {
    if (photoCaption !== defaultPhotoCaption) {
      editTextPhoto(item, photoCaption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoCaption]);

  React.useEffect(() => {
    setPhotoCaption(item?.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.text]);

  const [isDragging, drag] = useDrag({
    type: ItemTypes.PHOTO,
    item: { type: ItemTypes.PHOTO, id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging.isDragging ? 0.5 : 0.9999;
  const customStyle = isDragging.isDragging ? 'isDragging' : '';
  drag(drop(itemRef));

  const styleDnd: React.CSSProperties = {
    cursor: 'move'
  };

  const onStartParseFile = React.useCallback(() => {
    setIsParsingFile(true);
  }, []);

  const onParseFile = React.useCallback(
    parseFile => {
      editPhoto(item, parseFile);
      setIsParsingFile(false);
    },
    [item, editPhoto]
  );

  if (!item) return;

  const canTag = item?.uid
    ? user?.extra?.can_tag_friend_on_photo
    : item?.extra?.can_tag_friend;

  return (
    <div
      data-uid={item.uid}
      style={{ ...styleDnd, opacity }}
      ref={itemRef}
      className={clsx(classes.itemRoot, customStyle ? classes.isDragging : '')}
    >
      <div className={classes.itemMediaContainer}>
        <div className={classes.itemMediaBackdrop}>
          {isVideoType(item.file?.type) ? (
            <>
              <div className={classes.itemBlur}>
                <video
                  src={item.source}
                  draggable={false}
                  controls={false}
                  autoPlay={false}
                  muted
                  className={classes.itemBlurImg}
                />
              </div>
              <video
                src={item.source}
                draggable={false}
                controls={false}
                autoPlay={false}
                muted
                className={classes.itemMedia}
              />
            </>
          ) : (
            <>
              <div className={classes.itemBlur}>
                <img
                  draggable={false}
                  src={item.base64 || item.source || getImageSrc(item?.image)}
                  className={classes.itemBlurImg}
                  alt={item.uid}
                />
              </div>
              <ParserPreviewPhoto
                item={item}
                onParse={onParseFile}
                onError={() => removeItem(item)}
                onStartParseFile={onStartParseFile}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderTopLeftRadius: theme => theme.shape.borderRadius,
                  borderTopRightRadius: theme => theme.shape.borderRadius,
                  overflow: 'hidden'
                }}
              >
                <img
                  draggable={false}
                  src={item.base64 || item.source || getImageSrc(item?.image)}
                  className={classes.itemMedia}
                  alt={item.uid}
                />
              </ParserPreviewPhoto>
            </>
          )}
          {!isVideoType(item.file?.type) && !isParsingFile ? (
            <>
              <Box className={clsx(classes.editButton, classes.autoHideButton)}>
                <StyledIconButton
                  size="small"
                  color="primary"
                  icon="ico-pencil"
                  onClick={() => editItem(item)}
                  title={i18n.formatMessage({ id: 'edit' })}
                />
              </Box>
              {canTag ? (
                <Box className={clsx(classes.tagButton)}>
                  <StyledIconButton
                    onClick={() => tagItem(item)}
                    size="small"
                    color="primary"
                    icon="ico-price-tag"
                    title={i18n.formatMessage({ id: 'tag_friends' })}
                  />
                </Box>
              ) : null}
            </>
          ) : null}
          {hideRemove ? null : (
            <Box className={clsx(classes.closeButton, classes.autoHideButton)}>
              <StyledIconButton
                size="small"
                onClick={() => removeItem(item)}
                color="primary"
                icon="ico-close"
                title={i18n.formatMessage({ id: 'remove' })}
              />
            </Box>
          )}
        </div>
      </div>
      <div className={classes.itemComposerContainer}>
        <TextField
          value={photoCaption}
          variant="outlined"
          placeholder={i18n.formatMessage({ id: 'caption' })}
          fullWidth
          disabled={isParsingFile}
          InputLabelProps={{
            shrink: true
          }}
          className={classes.itemComposer}
          onChange={handleChangeCaption}
        />
      </div>
    </div>
  );
}
