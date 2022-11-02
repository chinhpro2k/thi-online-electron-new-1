import { Tag } from 'antd';
import React from 'react';
import { useDrag } from 'react-dnd';
const LuaChon = (props) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'luaChon',
        item: {
            value: props.value,
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
        canDrag: !props.isDisabled,
    }));
    return (React.createElement(Tag, { ref: drag, className: "answer-dnd-item", color: props.isDisabled ? '#bbb' : props.backgroundColor, style: {
            opacity: isDragging ? 0.5 : 1,
            pointerEvents: props.isDisabled ? 'none' : 'unset',
            cursor: props.isDisabled ? 'no-drop' : 'unset',
        } }, props.value));
};
export default LuaChon;
