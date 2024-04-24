/**
 * @type: block
 * name: marketplace_invoice.block.invoice
 * keyword: marketplace invoice
 * title: Marketplace Invoice
 */

import { createBlock } from '@metafox/framework';
import Base, { Props } from './Base';

export default createBlock<Props>({
  extendBlock: Base
});
