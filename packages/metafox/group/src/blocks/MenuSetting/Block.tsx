/**
 * @type: block
 * name: group.settings.menu
 * title: Group Menu Settings
 * keywords: group
 * description: Group Menu Settings
 * thumbnail:
 */
import { createBlock } from '@metafox/framework';
import Base from './Base';

export default createBlock<any>({
  extendBlock: Base,
  defaults: {
    blockLayout: 'Edit Info List',
    title: 'default_menus'
  }
});
