import { getToken, Messaging } from 'firebase/messaging';
import React from 'react';
import useGlobal from './useGlobal';

export type LoadingHook<T, E> = [T | undefined, boolean, E | undefined];

let messaging: Messaging;
type CallBackType = (x: string) => void;

export default function useFirebaseFCM(): [
  string,
  (x: CallBackType) => void,
  boolean
] {
  const { firebaseBackend } = useGlobal();
  const [token, setToken] = React.useState<string>();
  const [error, setError] = React.useState(false);
  const active = firebaseBackend?.checkActive();
  const tryConnect = React.useRef(0);

  if (!active) return ['', () => {}, true];

  if (!messaging && !error) {
    try {
      messaging = firebaseBackend.getMessaging();
    } catch (err) {
      setError(true);
    }
  }

  const handleGetToken = (callback: CallBackType) => {
    getToken(messaging)
      .then(data => {
        callback(data);
        setToken(data);
      })
      .catch(() => {
        if (tryConnect.current > 5) return;

        tryConnect.current = tryConnect.current + 1;
        handleGetToken(callback);
      });
  };

  return [token, handleGetToken, error];
}
