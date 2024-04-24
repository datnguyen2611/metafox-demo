/**
 * @type: ui
 * name: video.itemView.modalCard
 */
import { VideoItemShape } from '@metafox/video';
import VideoPlayer from '@metafox/ui/VideoPlayer';
import { Box } from '@mui/material';
import * as React from 'react';

type VideoItemModalViewProps = {
  item: VideoItemShape;
  hideActionMenu?: boolean;
  onMinimizePhoto: (minimize: boolean) => void;
  isNativeControl?: boolean;
};

export default function VideoItemModalView({
  item,
  onMinimizePhoto,
  isNativeControl = false
}: VideoItemModalViewProps) {
  if (!item) return null;

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <VideoPlayer
        src={item.video_url || item.destination || null}
        embed_code={item.embed_code}
        thumb_url={item.image}
        autoPlay
        isModalPlayer
        isNativeControl={isNativeControl}
      />
    </Box>
  );
}
