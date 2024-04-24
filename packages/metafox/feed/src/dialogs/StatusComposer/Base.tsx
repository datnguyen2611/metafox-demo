/**
 * @type: dialog
 * name: feed.status.statusComposerDialog
 * chunkName: dialog.StatusComposer
 */
import Editor from '@draft-js-plugins/editor';
import { Dialog } from '@metafox/dialog';
import {
  StatusComposerState,
  useGlobal,
  useLocation
} from '@metafox/framework';
import { editorStateToText, htmlToText, textToRaw } from '@metafox/utils';
import { Box, styled } from '@mui/material';
import { convertFromRaw, EditorState } from 'draft-js';
import { isEmpty, isEqual, get, isNil } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useStatusComposer from '../../hooks/useStatusComposer';
import ComposerAction from './ComposerAction';
import ComposerContent from './ComposerContent';
import ComposerHeader from './ComposerHeader';
import useStyles from './styles';
import editorStateToHtml from './editorStateToHtml';
import { REGEX_LENGTH_TEXT } from '@metafox/feed/constant';
import BlockLoading from './BlockLoading';
import { customExtractLinks } from '@metafox/feed/utils';

export const DialogStatusComposer = styled(Box)({
  position: 'relative'
});

export const ComposerContext = React.createContext(undefined);

export type StatusComposerDialogProps = {
  data: Partial<StatusComposerState>;
  editor?: {
    status_text?: string;
    status_background_id?: string;
  };
  id?: string;
  isEdit?: boolean;
  isEditSchedule?: boolean;
  parentIdentity?: string;
  title?: string;
  parentType?: string;
  hidePrivacy?: boolean;
  disabledPrivacy?: boolean;
  enableLeaveConfirm?: boolean;
};

const strategy = 'dialog';

// deepcompare prevent loop useEffect
// Should track and improve
function useDeepEffect(fn, deps) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isFirstEffect = isFirst.current;
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index])
    );

    isFirst.current = false;
    prevDeps.current = deps;

    if (isFirstEffect || !isSame) {
      return fn();
    }
  }, deps);
}

const StatusComposerDialog = ({
  data = {},
  editor,
  id,
  isEdit,
  isEditSchedule,
  parentIdentity,
  parentType,
  hidePrivacy,
  disabledPrivacy,
  title = 'create_post',
  pageParams,
  enableLeaveConfirm = true
}: StatusComposerDialogProps) => {
  const classes = useStyles();
  const location = useLocation();
  const {
    useDialog,
    dispatch,
    i18n,
    getSetting,
    getAcl,
    setNavigationConfirm,
    useSession,
    useGetItem
  } = useGlobal();
  const { user: authUser } = useSession();
  const parentId = parentIdentity ? parentIdentity.split('.')[3] : '';
  const item = useGetItem(parentIdentity);
  const isUserProfileOther =
    parentType === 'user' && parentId && authUser.id !== parseInt(parentId);
  const isUserProfileOwner =
    parentType === 'user' && parentId && authUser.id === parseInt(parentId);
  const [composerState, , composerRef] = useStatusComposer(data);
  const { dialogProps, setUserConfirm, forceClose } = useDialog();

  const editorRef = useRef<Editor>();
  const isFirstRun = useRef<boolean>(true);

  const [disabledSubmit, setDisabled] = useState<boolean>();
  const [loadingPreviewLink, setLoadingPreviewLink] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [asPage, setAsPage] = React.useState<boolean>(false);
  const isShare = get(composerState, 'attachments.shareItem.value');

  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(textToRaw(htmlToText(editor?.status_text || '')))
    )
  );

  const setting = getSetting() as Object;
  const acl = getAcl() as Object;

  const condition = React.useMemo(() => {
    const lengthText = editorStateToText(editorState)
      ? editorStateToText(editorState).replace(REGEX_LENGTH_TEXT, '$3')?.length
      : 0;

    return {
      strategy,
      item,
      attachmentType: composerState.attachmentType,
      attachments: composerState.attachments,
      lengthText,
      parentType,
      textLines: editorStateToText(editorState)?.split(/\r\n|\r|\n/).length,
      isEdit,
      data,
      setting,
      acl,
      isUserProfileOther,
      isUserProfileOwner
    };
  }, [
    item,
    composerState.attachmentType,
    composerState.attachments,
    editorState,
    parentType,
    isEdit,
    data,
    setting,
    acl,
    isUserProfileOther,
    isUserProfileOwner
  ]);

  const leaveConfirm = React.useMemo(() => {
    return {
      message: i18n.formatMessage({
        id: 'you_did_not_share_your_post'
      }),
      title: i18n.formatMessage({
        id: 'leave_page'
      }),
      negativeButton: {
        label: i18n.formatMessage({
          id: 'keep_editing'
        })
      },
      positiveButton: {
        label: i18n.formatMessage({
          id: 'leave'
        })
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAfterForceClose = useCallback(() => {
    forceClose();
    dispatch({
      type: 'formValues/onDestroy',
      payload: {
        formName: 'dialogStatusComposer'
      }
    });
  }, [dispatch, forceClose]);

  useEffect(() => {
    setNavigationConfirm(
      !disabledSubmit && enableLeaveConfirm,
      leaveConfirm,
      () => {
        setEditorState(
          EditorState.createWithContent(
            convertFromRaw(textToRaw(htmlToText('')))
          )
        );
        handleAfterForceClose();
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledSubmit]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;

      return;
    }

    forceClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (isEdit || isNil(get(composerState, 'attachments.link.value'))) return;

    const isHasLinkText = customExtractLinks({
      text: editorStateToText(editorState),
      recognizeMail: false
    });

    const hasBackgroundStatus = Boolean(
      get(composerState, 'attachments.statusBackground.value.id')
    );

    if (hasBackgroundStatus) {
      if (!isHasLinkText) {
        composerRef.current.removeAttachmentLink();
      }

      return;
    }

    if (
      (editorStateToText(editorState).trim() === '' || !isHasLinkText) &&
      composerState.attachments?.['link']?.value?.is_preview_hidden
    ) {
      composerRef.current.removeAttachmentLink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    editorState,
    composerState.attachments,
    composerState.attachmentType,
    composerRef.current
  ]);

  useDeepEffect(() => {
    const isHasTag =
      !isEmpty(composerState.tags?.place?.value) ||
      !isEmpty(composerState.tags?.friends?.value);
    let disabled =
      editorStateToText(editorState).trim() === '' &&
      (composerState.attachments?.['link']?.value?.is_preview_hidden ||
        !Object.keys(composerState.attachments || {})?.length) &&
      !isHasTag;
    const isDirty =
      composerState.editing ||
      editorStateToText(editorState) !== (editor?.status_text || '');

    if ((isEdit || isEditSchedule) && !disabled) {
      disabled = !isDirty;
    }

    if (composerState.disabled !== disabled) {
      composerRef.current.setDisabled(disabled);
    }

    setDisabled(submitting || loadingPreviewLink || disabled);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    submitting,
    editorState,
    composerState,
    composerRef,
    editor,
    loadingPreviewLink
  ]);

  const handleSubmit = useCallback(() => {
    setSubmitting(true);
    dispatch({
      type: 'statusComposer/SUBMIT',
      payload: {
        initValue: data,
        composerState: composerRef.current.state,
        text: editorStateToText(editorRef.current.props.editorState),
        isEdit,
        isEditSchedule,
        id,
        parentIdentity,
        parentUser: data?.parentUser
      },
      meta: {
        onSuccess: handleAfterForceClose,
        onFailure: () => setSubmitting(false)
      }
    });
  }, [
    dispatch,
    data,
    composerRef,
    isEdit,
    id,
    parentIdentity,
    handleAfterForceClose,
    isEditSchedule
  ]);

  setUserConfirm(() => {
    if (!disabledSubmit && (isEdit || isEditSchedule)) {
      return {
        message: i18n.formatMessage({
          id: 'the_change_you_made_will_not_be_saved'
        }),
        title: i18n.formatMessage({
          id: 'unsaved_changes'
        })
      };
    }
  });

  const handleClose = (e, reason) => {
    if (submitting) return;

    const contentState =
      editorRef.current?.props?.editorState?.getCurrentContent();

    // update form value to reducers
    !isEdit &&
      dispatch({
        type: 'formValues/onChange',
        payload: {
          formName: 'dialogStatusComposer',
          data: contentState.hasText()
            ? editorStateToHtml(editorRef.current?.props?.editorState)
            : ''
        }
      });

    dialogProps.onClose && dialogProps.onClose(e, reason);
  };

  return (
    <Dialog
      {...dialogProps}
      data-testid="dialogStatusComposer"
      fullWidth
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: theme => theme.middleBlock.maxWidth || '720px'
        }
      }}
    >
      <DialogStatusComposer>
        <ComposerContext.Provider
          value={{
            data,
            classes,
            composerState,
            composerRef,
            editorState,
            condition,
            setEditorState,
            isEdit,
            isEditSchedule,
            strategy,
            editor,
            editorRef,
            pageParams,
            asPage,
            setAsPage
          }}
        >
          <ComposerHeader title={title} closeDialog={handleClose} />
          <ComposerContent
            hidePrivacy={hidePrivacy}
            parentIdentity={parentIdentity}
            parentType={parentType}
            disabledPrivacy={disabledPrivacy}
            setLoadingPreviewLink={setLoadingPreviewLink}
            loadingPreviewLink={loadingPreviewLink}
            submitting={submitting}
          />
          <ComposerAction
            submitting={submitting}
            onSubmit={handleSubmit}
            disabledSubmit={disabledSubmit}
            parentIdentity={parentIdentity}
            parentType={parentType}
            isShare={isShare}
          />
        </ComposerContext.Provider>
        {submitting ? <BlockLoading /> : null}
      </DialogStatusComposer>
    </Dialog>
  );
};

export default StatusComposerDialog;
