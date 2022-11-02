import React from 'react';
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
const _getFileExtension = (url) => {
    if (!url) {
        return '';
    }
    const urlSplits = url.split('.');
    return urlSplits.length ? urlSplits[urlSplits.length - 1].toLowerCase() : '';
};
const RenderMultimedia = ({ src, style = {} }) => {
    if (AUDIO_EXTENSIONS.includes(_getFileExtension(src))) {
        return (React.createElement("audio", { style: Object.assign({ verticalAlign: 'middle', outline: 'none' }, style), controls: true, controlsList: "nodownload", src: src }));
    }
    return (React.createElement("video", { style: Object.assign({}, style), width: "320", height: "240", controls: true, controlsList: "nodownload", src: src }));
};
export default RenderMultimedia;
