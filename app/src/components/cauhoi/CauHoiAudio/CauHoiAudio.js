import { Button, Statistic } from 'antd';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
const CauHoiAudio = (props) => {
    const [recordState, setRecordState] = useState(RecordState.STOP);
    const [audioData, setAudioData] = useState(null);
    const [isTouched, setTouched] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        let interval;
        if (recordState === RecordState.START) {
            interval = setInterval(() => {
                setDuration((oldDuration) => oldDuration + 1000);
            }, 1000);
        }
        else if (recordState === RecordState.STOP) {
            setDuration(0);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [recordState]);
    const onStop = (data) => {
        setAudioData(data);
        props.onStop(data);
    };
    const onStartRecord = () => {
        setRecordState(RecordState.START);
        setTouched(true);
    };
    const momentDuration = moment.duration(duration);
    const formattedDuration = String(momentDuration.hours()).padStart(2, '0') +
        ':' +
        String(momentDuration.minutes()).padStart(2, '0') +
        ':' +
        String(momentDuration.seconds()).padStart(2, '0');
    return (React.createElement("div", { style: { marginTop: '8px' } },
        React.createElement("div", { style: { display: isTouched ? 'block' : 'none' } },
            React.createElement("audio", { controls: recordState === RecordState.STOP, onPause: () => setButtonDisabled(false), onPlay: () => setButtonDisabled(true), controlsList: "nodownload", src: (audioData === null || audioData === void 0 ? void 0 : audioData.url) || '', itemType: "audio/wav", style: { outline: 'none' } }),
            React.createElement(Statistic, { style: {
                    display: recordState === RecordState.STOP ? 'none' : 'block',
                }, value: formattedDuration }),
            React.createElement(AudioReactRecorder, { state: recordState, onStop: onStop, canvasHeight: 200 })),
        React.createElement(Button, { onClick: onStartRecord, disabled: buttonDisabled || recordState === RecordState.START, style: { marginRight: '8px' } }, "Ghi \u00E2m"),
        React.createElement(Button, { onClick: () => setRecordState(RecordState.STOP), disabled: buttonDisabled || recordState === RecordState.STOP }, "D\u1EEBng")));
};
export default CauHoiAudio;
