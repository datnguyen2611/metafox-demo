/**
 * @type: block
 * name: pages.settings.menu
 * title: Page Menu Settings
 * keywords: page
 * description: Page Menu Settings
 * thumbnail:
 */
import { createBlock } from '@metafox/framework';
import Base from './Base';

export default createBlock<any>({
  extendBlock: Base,
  defaults: {
    blockLayout: 'Account Setting',
    title: 'default_menus'
  }
});
