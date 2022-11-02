import { Tag } from 'antd';
import React from 'react';
import { useDrop } from 'react-dnd';
const DapAnPlaceholder = (props) => {
    var _a;
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'luaChon',
        drop: (item) => props.pickOptionToPlaceholder(props.placeholderKey, item.value),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [props.placeholderKey]);
    const removeAnswered = (e) => {
        e.preventDefault();
        props.removeAnswered(props.placeholderKey);
    };
    return (React.createElement(Tag, { ref: drop, className: "answer-placeholder", color: isOver ? '#bbb' : undefined, style: { width: props.value ? 'unset' : '60px' }, closable: !!props.value, onClose: removeAnswered },
        React.createElement("span", null, (_a = props.value) !== null && _a !== void 0 ? _a : '')));
};
export default DapAnPlaceholder;
