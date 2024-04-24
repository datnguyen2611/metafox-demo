/**
 * @type: block
 * name: music.block.musicPlaylistListingBlock
 * title: Music Playlists
 * keywords: music
 * description:
 * thumbnail:
 */
import { createBlock, ListViewBlockProps } from '@metafox/framework';

const MusicPlaylistListingBlock = createBlock<ListViewBlockProps>({
  name: 'MusicPlaylistListingBlock',
  extendBlock: 'core.block.listview'
});

export default MusicPlaylistListingBlock;
