import Editor from '@draft-js-plugins/editor';
import { DialogContent, useDialog } from '@metafox/dialog';
import useComposerContext from '@metafox/feed/hooks/useComposerContext';
import {
  LinkShape,
  useDraftEditorConfig,
  useGlobal,
  useSession,
  useResourceAction
} from '@metafox/framework';
import { ScrollContainer } from '@metafox/layout';
import useAddPhotoToStatusComposerHandler from '@metafox/photo/hooks/useAddPhotoToStatusComposerHandler';
import { TruncateText, UserAvatar } from '@metafox/ui';
import PrivacyView from '@metafox/ui/PrivacyView';
import { editorStateToText } from '@metafox/utils';
import { useMediaQuery, Box, CircularProgress } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import {
  concat,
  debounce,
  get,
  isEmpty,
  isObject,
  orderBy,
  uniq,
  isArray
} from 'lodash';
import { EditorState, SelectionState, Modifier } from 'draft-js';
import React, { useCallback, useEffect, useState } from 'react';
import composerConfig from '../../composerConfig';
import PrivacyControl from './PrivacyControl';
import AsPageAction from './AsPageAction';
import { customExtractLinks } from '@metafox/feed/utils';
import { REGEX_LENGTH_TEXT } from '@metafox/feed/constant';

const APP_PAGE = 'page';

const AvatarWrapper = styled('div', { name: 'AvatarWrapper' })(({ theme }) => ({
  marginRight: theme.spacing(1.5)
}));

const ComposerWrapper = styled('div', { name: 'ComposerWrapper' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 0, 0, 2),
    minWidth: 'calc(100% - 110px)'
  })
);

const Root = styled(DialogContent, { name: 'Root' })(({ theme }) => ({
  maxHeight: 'unset !important',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 !important',
  position: 'relative',
  zIndex: 1300,
  [theme.breakpoints.down('sm')]: {
    width: 'unset',
    overflow: 'visible'
  }
}));

const CHARACTER_LIMIT_BACKGROUND_STATUS = 150;
const LINES_LIMIT_BACKGROUND_STATUS = 3;

interface Props {
  hidePrivacy: boolean;
  parentIdentity?: string;
  parentType?: string;
  disabledPrivacy?: boolean;
  setLoadingPreviewLink?: any;
  loadingPreviewLink?: boolean;
}

const ComposerContent = ({
  submitting,
  hidePrivacy,
  parentIdentity,
  parentType,
  disabledPrivacy,
  setLoadingPreviewLink,
  loadingPreviewLink
}: Props) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { jsxBackend, i18n, dispatch, dialogBackend, useGetItem } = useGlobal();
  const parentUser = useGetItem(parentIdentity);
  const { user: authUser } = useSession();
  const { dialogProps } = useDialog();
  const {
    data: initData,
    classes,
    composerState,
    composerRef,
    editorRef,
    editorState,
    condition,
    setEditorState,
    isEdit,
    strategy,
    editor,
    asPage,
    setAsPage,
    isEditSchedule
  } = useComposerContext();

  const [editorPlugins, editorComponents, editorControls, editorAttachers] =
    useDraftEditorConfig(composerConfig, condition);
  const [onChangeFile] = useAddPhotoToStatusComposerHandler(
    composerRef,
    undefined,
    { parentUser }
  );
  const [errorLink, setErrorLink] = useState<string>();
  // set config mention on case has parentUser
  const configMention = useResourceAction(
    parentUser?.module_name,
    parentUser?.resource_name,
    'getForMentionInFeed'
  );

  const placeholder = i18n.formatMessage(
    {
      id: composerState?.parentUser
        ? 'write_something_to_parent_user'
        : 'what_s_your_mind'
    },
    { user: composerState?.parentUser?.name }
  );

  const hasStatusBackground =
    !isEmpty(get(composerState, 'editorStyle')) &&
    composerState.className === 'withBackgroundStatus';

  const hasBackgroundAndLink = Boolean(
    get(composerState, 'attachments.statusBackground.value.id') &&
      composerState.attachmentType === 'link' &&
      get(composerState, 'attachments.link.value.is_preview_hidden') &&
      get(composerState, 'attachments.link.value.link')
  );

  const hasAttachmentPhotos = get(composerState, 'attachments.photo.value');

  const hasAttachmentPoll = get(composerState, 'attachments.poll.value');

  const hasShareItem = get(composerState, 'attachments.shareItem.value');

  useEffect(() => {
    if (
      composerState.attachmentType === 'backgroundStatus' ||
      hasStatusBackground ||
      hasBackgroundAndLink
    ) {
      const length = editorStateToText(editorState)?.replace(
        REGEX_LENGTH_TEXT,
        '$3'
      )?.length;
      const lines = editorStateToText(editorState)?.split(/\r\n|\r|\n/).length;

      if (length > CHARACTER_LIMIT_BACKGROUND_STATUS) {
        composerRef.current.hideBackground();
      } else if (lines > LINES_LIMIT_BACKGROUND_STATUS) {
        composerRef.current.hideBackground();
      } else {
        composerRef.current.displayBackground();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState, hasStatusBackground, hasBackgroundAndLink]);

  useEffect(() => {
    composerRef.current.setPostAsPage(asPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPage]);

  useEffect(() => {
    if (
      isEmpty(initData) ||
      isEmpty(initData.attachmentType) ||
      isEdit ||
      isEditSchedule
    )
      return;

    const { attachmentType } = initData;

    const attachment = initData.attachments[attachmentType];

    if (isEmpty(attachment)) return;

    const { value, as } = initData.attachments[attachmentType];
    const valueComposer =
      composerState.attachments[attachmentType]?.value || [];
    const newAttachment = isArray(value)
      ? uniq(concat(valueComposer, value)).filter(Boolean)
      : value;

    if (
      composerState.attachmentType === 'backgroundStatus' &&
      attachmentType !== 'backgroundStatus'
    ) {
      composerRef.current.removeBackground();
    }

    composerRef.current.setForceAttachments(attachmentType, attachmentType, {
      as,
      value: newAttachment
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [composerRef, initData]);

  const moveSelectionToEnd = (editorState: EditorState) => {
    const content = editorState.getCurrentContent();
    const blockMap = content.getBlockMap();

    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();

    const selection = new SelectionState({
      anchorKey: key,
      anchorOffset: length,
      focusKey: key,
      focusOffset: length
    });

    return selection;
  };

  const focusToEndText = () => {
    if (editorState?.getCurrentContent()?.getPlainText()) {
      setEditorState(
        EditorState.acceptSelection(
          editorState,
          moveSelectionToEnd(editorState)
        )
      );
    }

    editorRef.current?.focus();
  };

  useEffect(() => {
    // setImmediate(() => focusToEndText());
    setTimeout(() => {
      focusToEndText();
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogProps.open]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const setPrivacyValue = useCallback(
    (value: unknown) => {
      composerRef.current.setPrivacy(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handlePreviewLink = (editorStateProp: EditorState) => {
    if (
      (isEdit && composerState.post_type !== 'link') ||
      hasAttachmentPhotos ||
      hasAttachmentPoll ||
      hasShareItem
    )
      return;

    const currentText = editorStateToText(editorState);
    const nextText = editorStateToText(editorStateProp);

    if (currentText === nextText) return;

    const links = customExtractLinks({
      text: nextText,
      recognizeMail: false
    });

    if (!links || links[links.length - 1].url === errorLink) return;

    if (
      links[links.length - 1].url ===
        composerState.attachments['link']?.value?.link &&
      composerState.attachments['link']?.value?.is_preview_hidden
    ) {
      composerRef.current.setAttachments('link', 'link', {
        as: 'StatusComposerControlPreviewLink',
        value: {
          ...composerState.attachments['link']?.value,
          is_preview_hidden: hasStatusBackground ? true : false
        }
      });

      return;
    }

    if (
      links[links.length - 1].url ===
      composerState.attachments['link']?.value?.link
    )
      return;

    setLoadingPreviewLink(true);

    composerRef.current.setAttachments('link', 'link', {
      as: 'StatusComposerControlPreviewLink',
      value: {
        ...composerState.attachments['link']?.value,
        is_preview_hidden: true
      }
    });
    dispatch({
      type: 'statusComposer/getLink',
      payload: links[links.length - 1].url,
      meta: {
        onSuccess: (data: LinkShape) => {
          composerRef.current.setAttachments('link', 'link', {
            as: 'StatusComposerControlPreviewLink',
            value: {
              ...data,
              is_preview_hidden: hasStatusBackground ? true : false
            }
          });
          setErrorLink(undefined);
          setLoadingPreviewLink(false);
        },
        onFailure: (data: string) => {
          setLoadingPreviewLink(false);

          // will remove check when platform support change post_type
          if (isEdit) return;

          setErrorLink(data);

          composerState.attachments['link'] &&
            composerRef.current.removeAttachmentLink();
        }
      }
    });
  };

  const debouncePreviewLink = debounce(handlePreviewLink, 500);

  const handleChangeCompose = (editorState: EditorState) => {
    debouncePreviewLink(editorState);
    setEditorState(editorState);
  };

  const handlePastedFiles = (files: Blob[]) => {
    if (!editorAttachers?.length) return;

    const canPastFile = editorAttachers.find(
      x =>
        x?.as === 'statusComposer.control.StatusUploadPhotoButton' &&
        !x?.disabled
    );

    if (!canPastFile) {
      dialogBackend.alert({
        message: i18n.formatMessage({ id: 'cant_add_attachment' })
      });
    } else {
      onChangeFile(files);
    }

    return 'handled';
  };

  const handleBeforeInput = chars => {
    if (chars === '. ') {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();

      setEditorState(
        EditorState.set(editorState, {
          currentContent: Modifier.replaceText(
            content,
            selection.merge({
              anchorOffset: selection.getAnchorOffset() - 1
            }),
            '. '
          )
        })
      );

      return 'handled';
    }

    return 'not-handled';
  };

  const scrollProps = isSmallScreen ? { autoHeightMax: 'none' } : {};
  const scrollRef = React.useRef<HTMLDivElement>();

  return (
    <Root>
      <div className={classes.infoWrapper}>
        {parentUser?.item_type === APP_PAGE &&
        !isEdit &&
        parentUser?.is_admin ? (
          <AsPageAction asPage={asPage} setAsPage={setAsPage} page={parentUser}>
            <div className={classes.buttonWrapper}>
              {!hidePrivacy ? (
                <div className={classes.privacyButton}>
                  <PrivacyControl
                    disabled={disabledPrivacy}
                    setValue={setPrivacyValue}
                    value={composerState.privacy}
                  />
                </div>
              ) : (
                <div className={classes.privacyButton}>
                  <PrivacyView
                    item={
                      composerState?.privacy_feed ||
                      composerState?.privacy_detail
                    }
                  />
                </div>
              )}
            </div>
          </AsPageAction>
        ) : (
          <>
            <AvatarWrapper>
              <UserAvatar user={authUser as any} size={48} noStory />
            </AvatarWrapper>
            <div>
              <div className={classes.userName}>
                <TruncateText
                  lines={1}
                  variant="h5"
                  className={classes.userName}
                >
                  {asPage ? parentUser.name : authUser?.full_name}
                </TruncateText>
              </div>
              <div className={classes.buttonWrapper}>
                {!hidePrivacy ? (
                  <div className={classes.privacyButton}>
                    <PrivacyControl
                      disabled={disabledPrivacy}
                      setValue={setPrivacyValue}
                      value={composerState.privacy}
                    />
                  </div>
                ) : (
                  <div className={classes.privacyButton}>
                    <PrivacyView
                      item={
                        composerState?.privacy_feed ||
                        composerState?.privacy_detail
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Box pb={3} onClickCapture={focusEditor}>
        <ScrollContainer autoHide autoHeight ref={scrollRef} {...scrollProps}>
          <div
            className={clsx(classes.contentWrapper, composerState.className)}
          >
            <ComposerWrapper>
              <div className={classes.composeInner}>
                <div
                  className={clsx(classes.composer, composerState.className)}
                  style={composerState.editorStyle}
                  onClick={focusEditor}
                  data-testid="fieldStatus"
                >
                  <Editor
                    stripPastedStyles
                    handlePastedFiles={handlePastedFiles}
                    ref={editorRef}
                    textAlignment={composerState.textAlignment}
                    editorState={editorState}
                    plugins={editorPlugins}
                    placeholder={placeholder}
                    onChange={handleChangeCompose}
                    handleBeforeInput={handleBeforeInput}
                  />
                </div>
              </div>
            </ComposerWrapper>
            <div className={classes.attachIconsWrapper}>
              {editorControls.map(item =>
                jsxBackend.render({
                  component: item.as,
                  props: {
                    disabled: item.disabled,
                    key: item.as,
                    strategy,
                    classes,
                    editorRef,
                    composerRef,
                    value: editor
                  }
                })
              )}
            </div>
          </div>
          <div className={classes.editorComponentsWrapper}>
            {jsxBackend.render(
              editorComponents.map(x => ({
                ...x,
                props: {
                  ...(x.props || {}),
                  userId: asPage ? parentUser?.id : authUser?.id,
                  userIdentity: asPage
                    ? parentUser?._identity
                    : authUser?._identity,
                  configMention,
                  parentUser
                }
              }))
            )}
          </div>
          <div className={classes.attachmentStage}>
            {isObject(composerState.attachments) &&
              Object.values(composerState.attachments).map(
                (attachment: any) =>
                  attachment &&
                  jsxBackend.render({
                    component: attachment.as,
                    props: {
                      key: attachment.as,
                      value: attachment.value,
                      composerRef,
                      editorRef,
                      isEdit,
                      parentUser,
                      submitting
                    }
                  })
              )}
            {hasStatusBackground ? null : (
              <Box>
                {loadingPreviewLink === true ? (
                  <div className={classes.loading}>
                    <CircularProgress size={30} />
                  </div>
                ) : null}
              </Box>
            )}
          </div>
        </ScrollContainer>
      </Box>
      <div className={classes.tagsStage}>
        {orderBy(Object.values(composerState.tags), 'priority').map(
          (data: any) =>
            jsxBackend.render({
              component: data.as,
              props: {
                key: data.as,
                value: data.value,
                composerRef,
                editorRef,
                parentType,
                parentIdentity,
                userId: asPage ? parentUser?.id : authUser?.id,
                userIdentity: asPage
                  ? parentUser?._identity
                  : authUser?._identity
              }
            })
        )}
      </div>
      {composerState?.schedule_time?.value
        ? jsxBackend.render({
            component: composerState.schedule_time.as,
            props: {
              key: composerState.schedule_time.as,
              value: composerState.schedule_time.value,
              composerRef,
              editorRef,
              parentType,
              parentIdentity,
              userId: asPage ? parentUser?.id : authUser?.id,
              userIdentity: asPage ? parentUser?._identity : authUser?._identity
            }
          })
        : null}
    </Root>
  );
};

export default ComposerContent;
