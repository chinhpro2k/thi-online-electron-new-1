import { CauHoi } from '@/src/views/app-thionline/typing';
import { Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  decodeCauHoi,
  getIndexFromPlaceholder,
  isAnswerPlaceholder,
} from '../utils';

type CauHoiDienOTrongProps = {
  cauHoi: CauHoi;
  value?: string[];
  onChange?: (data: string[]) => void;
};

const CauHoiDienOTrong = (props: CauHoiDienOTrongProps) => {
  const [answereds, setAnswereds] = useState<string[]>([]);

  useEffect(() => {
    const data = decodeCauHoi(props.cauHoi.noiDung.cauHoi);
    const initAnswereds: string[] = [];
    data.forEach((item) => {
      if (!isAnswerPlaceholder(item)) {
        return;
      }
      initAnswereds.push('');
    });
    setAnswereds(initAnswereds);
    props.onChange?.(initAnswereds);
  }, []);

  const updateAnswer = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedAnswereds = answereds.map((answer, i) => {
      return i === index ? e.target.value : answer;
    });
    setAnswereds(updatedAnswereds);
    props.onChange?.(updatedAnswereds);
  };

  return (
    <div style={{ marginTop: '10px' }}>
      {decodeCauHoi(props.cauHoi.noiDung.cauHoi).map((item, index) => {
        if (!isAnswerPlaceholder(item)) {
          return (
            <span style={{ display: 'inline' }} key={index}>
              {item}
            </span>
          );
        }
        const answerIndex = getIndexFromPlaceholder(item);
        return (
          <Input
            maxLength={100}
            value={answereds[answerIndex]}
            onChange={(e) => updateAnswer(answerIndex, e)}
            size="small"
            key={index}
            style={{ width: '80px' }}
          />
        );
      })}
    </div>
  );
};

export default CauHoiDienOTrong;
