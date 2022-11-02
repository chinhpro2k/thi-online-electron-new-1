import React from 'react';

type Props = {
  src?: string;
  style?: React.CSSProperties;
};

const AUDIO_EXTENSIONS = [
  'm4a',
  'mp3',
  'aac',
  'flac',
  'wav',
  'wma',
  'aiff',
  'ogg',
];

const _getFileExtension = (url: string | undefined) => {
  if (!url) {
    return '';
  }

  const urlSplits = url.split('.');
  return urlSplits.length ? urlSplits[urlSplits.length - 1].toLowerCase() : '';
};

const RenderMultimedia = ({ src, style = {} }: Props) => {
  if (AUDIO_EXTENSIONS.includes(_getFileExtension(src))) {
    return (
      <audio
        style={{
          verticalAlign: 'middle',
          outline: 'none',
          ...style,
        }}
        controls
        controlsList="nodownload"
        src={src}
      />
    );
  }
  return (
    <video
      style={{ ...style }}
      width="320"
      height="240"
      controls
      controlsList="nodownload"
      src={src}
    />
  );
};

export default RenderMultimedia;
