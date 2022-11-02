import { Button, Statistic } from 'antd';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

type CauHoiAudioProps = {
  onStop: (data: any) => void;
};

const CauHoiAudio = (props: CauHoiAudioProps) => {
  const [recordState, setRecordState] = useState(RecordState.STOP);
  const [audioData, setAudioData] = useState<any>(null);
  const [isTouched, setTouched] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    if (recordState === RecordState.START) {
      interval = setInterval(() => {
        setDuration((oldDuration) => oldDuration + 1000);
      }, 1000);
    } else if (recordState === RecordState.STOP) {
      setDuration(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [recordState]);

  const onStop = (data: any) => {
    setAudioData(data);
    props.onStop(data);
  };

  const onStartRecord = () => {
    setRecordState(RecordState.START);
    setTouched(true);
  };

  const momentDuration = moment.duration(duration);
  const formattedDuration =
    String(momentDuration.hours()).padStart(2, '0') +
    ':' +
    String(momentDuration.minutes()).padStart(2, '0') +
    ':' +
    String(momentDuration.seconds()).padStart(2, '0');

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: isTouched ? 'block' : 'none' }}>
        <audio
          controls={recordState === RecordState.STOP}
          onPause={() => setButtonDisabled(false)}
          onPlay={() => setButtonDisabled(true)}
          controlsList="nodownload"
          src={audioData?.url || ''}
          itemType="audio/wav"
          style={{ outline: 'none' }}
        />
        <Statistic
          style={{
            display: recordState === RecordState.STOP ? 'none' : 'block',
          }}
          value={formattedDuration}
        />
        <AudioReactRecorder
          state={recordState}
          onStop={onStop}
          canvasHeight={200}
        />
      </div>
      <Button
        onClick={onStartRecord}
        disabled={buttonDisabled || recordState === RecordState.START}
        style={{ marginRight: '8px' }}
      >
        Ghi âm
      </Button>
      <Button
        onClick={() => setRecordState(RecordState.STOP)}
        disabled={buttonDisabled || recordState === RecordState.STOP}
      >
        Dừng
      </Button>
    </div>
  );
};

export default CauHoiAudio;
