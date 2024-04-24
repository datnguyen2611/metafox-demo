/**
 * @type: ui
 * name: dialog.itemProvider
 */
import { useGlobal } from '@metafox/framework';
import { isFunction, isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import DialogContext from './DialogContext';
import { TDialogProvider, UserConfirmCallback } from './types';

export default function DialogProvider({
  content,
  resolve,
  onClose,
  isLast,
  onEnter,
  onEntering,
  onEntered,
  onExiting,
  onExited,
  type,
  open,
  forceClose,
  backdropClose
}: TDialogProvider) {
  const { jsxBackend, dialogBackend, useTheme, i18n, setNavigationConfirm } =
    useGlobal();
  const theme = useTheme();
  const valueRef = React.useRef<any>();
  const needNavigationConfirm = React.useRef(false);
  const [navigationConfirmValue, setNavigationConfirmValue] = React.useState(0);
  const confirmRef = React.useRef<UserConfirmCallback>();
  const disableBackdropCloseRef = React.useRef<boolean>(backdropClose);

  const setDialogValue = React.useCallback(
    (value: any) => {
      valueRef.current = value;
      forceClose();
    },
    [forceClose]
  );

  const setDialogResolveValue = React.useCallback(
    (value: any) => {
      valueRef.current = value;
      resolve(valueRef.current);
    },
    [resolve]
  );

  const disableBackdropClick = React.useCallback((enabled: boolean) => {
    disableBackdropCloseRef.current = enabled;
  }, []);

  const confirmValue = isFunction(confirmRef.current)
    ? confirmRef.current()
    : confirmRef.current;

  const handleUserConfirm = React.useCallback(
    (evt, reason) => {
      if (disableBackdropCloseRef.current && reason === 'backdropClick') {
        return;
      }

      const confirmValue = isFunction(confirmRef.current)
        ? confirmRef.current()
        : confirmRef.current;

      (async () => {
        // "true", nope require setDialogValue to close.
        if (confirmValue === true) {
          return;
        }

        if (!confirmValue) {
          return onClose();
        }

        const {
          message,
          title = i18n.formatMessage({ id: 'discard_change' })
        } = confirmValue;

        if (!message) {
          onClose();
        }

        const result = await dialogBackend.confirm({ title, message });

        if (result) {
          onClose();

          if (needNavigationConfirm?.current) {
            needNavigationConfirm.current = false;
            setNavigationConfirm(false);
          }
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [confirmValue]
  );

  const isMobile = theme.breakpoints.values.sm >= window.screen.width;

  React.useEffect(() => {
    if (!setNavigationConfirm || !needNavigationConfirm?.current) return;

    const confirmValue = isFunction(confirmRef.current)
      ? confirmRef.current()
      : confirmRef.current;

    setNavigationConfirm(!isEmpty(confirmValue), confirmValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationConfirmValue]);

  React.useEffect(() => {
    return () => {
      if (needNavigationConfirm?.current) {
        setNavigationConfirm && setNavigationConfirm(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserConfirm = useCallback(
    (callback: UserConfirmCallback, shouldCheckNavigation: boolean = false) => {
      confirmRef.current = callback;
      needNavigationConfirm.current = shouldCheckNavigation;

      if (shouldCheckNavigation) {
        setNavigationConfirmValue(prev => prev + 1);
      }
    },
    []
  );

  const dialogProps = React.useMemo(() => {
    return {
      type,
      dialogProps: {
        open,
        fullScreen: isMobile,
        onClose: handleUserConfirm,
        fullWidth: true,
        TransitionProps: {
          onEnter,
          onEntered,
          onEntering,
          onExit: () => resolve(valueRef.current),
          onExiting,
          onExited
        },
        className: isLast ? 'isLastDialog' : 'notLastDialog'
      },
      closeDialog: handleUserConfirm,
      disableBackdropClick,
      setDialogValue,
      setUserConfirm,
      setDialogResolveValue,
      forceClose
    };
  }, [
    type,
    open,
    isMobile,
    handleUserConfirm,
    onEnter,
    onEntered,
    onEntering,
    onExiting,
    onExited,
    isLast,
    setDialogValue,
    setDialogResolveValue,
    setUserConfirm,
    forceClose,
    disableBackdropClick,
    resolve
  ]);

  return (
    <DialogContext.Provider value={dialogProps}>
      {jsxBackend.render(content)}
    </DialogContext.Provider>
  );
}
