import React from 'react';
import { CauHoi, CauTraLoi } from '@/src/views/app-thionline/typing';
import './index.less';
import { useState } from 'react';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DanhSachLuaChon from './DanhSachLuaChon';
import DapAnPlaceholder from './DapAnPlaceholder';
import {
  decodeCauHoi,
  getIndexFromPlaceholder,
  isAnswerPlaceholder,
} from '../utils';

type CauHoiKeoThaProps = {
  cauHoi: CauHoi;
  value?: string[];
  onChange?: (data: string[]) => void;
};

const CauHoiKeoTha = (props: CauHoiKeoThaProps) => {
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

  const pickOptionToPlaceholder = (placeholderIndex: number, value: string) => {
    setAnswereds((prevAnswereds) => {
      const updateAnswereds = prevAnswereds.map((item, index) => {
        return placeholderIndex === index ? value : item;
      });
      props.onChange?.(updateAnswereds);
      return updateAnswereds;
    });
  };

  const removeAnswered = (placeholderIndex: number) => {
    const updateAnswereds = answereds.map((item, index) => {
      return placeholderIndex === index ? '' : item;
    });
    props.onChange?.(updateAnswereds);
    setAnswereds(updateAnswereds);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="question-dnd-wrapper">
        <DanhSachLuaChon
          dsCauTraLoi={props.cauHoi.noiDung.cauTraLoi}
          answereds={answereds}
        />
        <div>
          {decodeCauHoi(props.cauHoi.noiDung.cauHoi).map((item, index) => {
            if (!isAnswerPlaceholder(item)) {
              return (
                <span className="question-text" key={index}>
                  {item}
                </span>
              );
            }
            const answerIndex = getIndexFromPlaceholder(item);
            return (
              <DapAnPlaceholder
                key={index}
                placeholderKey={answerIndex}
                value={answereds[answerIndex]}
                pickOptionToPlaceholder={pickOptionToPlaceholder}
                removeAnswered={removeAnswered}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};

export default CauHoiKeoTha;
