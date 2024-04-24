/**
 * @type: embedView
 * name: music_song_set.embedItem.insideFeedItem
 */

import {
  actionCreators,
  connectItemView
} from '@metafox/music/hocs/connectAlbumItem';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
