/**
 * @type: service
 * name: useMediaPlaying
 */

import Context from './Context';
import { get } from 'lodash';
import { useContext } from 'react';

export default function useMediaPlaying(
  id: string
): [boolean, (x: boolean) => void] {
  const [value, setValue] = useContext(Context);
  const playing = !!get(value, id);

  const setPlaying = (x: boolean) => {
    if (playing === x) return;

    setValue({ [id]: x });
  };

  return [playing, setPlaying];
}
