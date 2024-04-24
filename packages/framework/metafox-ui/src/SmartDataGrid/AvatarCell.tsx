/**
 * @type: ui
 * name: dataGrid.cell.AvatarCell
 */

import { UserAvatar } from '@metafox/ui';
import React from 'react';

export default function AvatarCell({ row, colDef }) {
  return (
    <div className="middleAlign">
      <UserAvatar
        size={colDef?.size || 32}
        user={{ ...row, link: row?.user_link || row?.link }}
        srcSizePrefers={colDef?.sizePrefers || '50x50'}
        variant={colDef?.variant}
        hoverCard={false}
      />
    </div>
  );
}
