import { Tag } from 'antd';
import React from 'react';
import { useDrop } from 'react-dnd';

type DapAnPlaceholderType = {
  placeholderKey: number;
  value: string;
  pickOptionToPlaceholder: (placeholderKey: number, value: string) => void;
  removeAnswered: (placeholderKey: number) => void;
};

const DapAnPlaceholder = (props: DapAnPlaceholderType) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'luaChon',
      drop: (item: { value: string }) =>
        props.pickOptionToPlaceholder(props.placeholderKey, item.value),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [props.placeholderKey]
  );

  const removeAnswered = (e: React.MouseEvent) => {
    e.preventDefault();
    props.removeAnswered(props.placeholderKey);
  };

  return (
    <Tag
      ref={drop}
      className="answer-placeholder"
      color={isOver ? '#bbb' : undefined}
      style={{ width: props.value ? 'unset' : '60px' }}
      closable={!!props.value}
      onClose={removeAnswered}
    >
      <span>{props.value ?? ''}</span>
    </Tag>
  );
};

export default DapAnPlaceholder;
