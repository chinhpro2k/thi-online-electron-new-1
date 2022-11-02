import React from 'react';
import './index.less';
import { useState } from 'react';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DanhSachLuaChon from './DanhSachLuaChon';
import DapAnPlaceholder from './DapAnPlaceholder';
import { decodeCauHoi, getIndexFromPlaceholder, isAnswerPlaceholder, } from '../utils';
const CauHoiKeoTha = (props) => {
    const [answereds, setAnswereds] = useState([]);
    useEffect(() => {
        var _a;
        const data = decodeCauHoi(props.cauHoi.noiDung.cauHoi);
        const initAnswereds = [];
        data.forEach((item) => {
            if (!isAnswerPlaceholder(item)) {
                return;
            }
            initAnswereds.push('');
        });
        setAnswereds(initAnswereds);
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, initAnswereds);
    }, []);
    const pickOptionToPlaceholder = (placeholderIndex, value) => {
        setAnswereds((prevAnswereds) => {
            var _a;
            const updateAnswereds = prevAnswereds.map((item, index) => {
                return placeholderIndex === index ? value : item;
            });
            (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, updateAnswereds);
            return updateAnswereds;
        });
    };
    const removeAnswered = (placeholderIndex) => {
        var _a;
        const updateAnswereds = answereds.map((item, index) => {
            return placeholderIndex === index ? '' : item;
        });
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, updateAnswereds);
        setAnswereds(updateAnswereds);
    };
    return (React.createElement(DndProvider, { backend: HTML5Backend },
        React.createElement("div", { className: "question-dnd-wrapper" },
            React.createElement(DanhSachLuaChon, { dsCauTraLoi: props.cauHoi.noiDung.cauTraLoi, answereds: answereds }),
            React.createElement("div", null, decodeCauHoi(props.cauHoi.noiDung.cauHoi).map((item, index) => {
                if (!isAnswerPlaceholder(item)) {
                    return (React.createElement("span", { className: "question-text", key: index }, item));
                }
                const answerIndex = getIndexFromPlaceholder(item);
                return (React.createElement(DapAnPlaceholder, { key: index, placeholderKey: answerIndex, value: answereds[answerIndex], pickOptionToPlaceholder: pickOptionToPlaceholder, removeAnswered: removeAnswered }));
            })))));
};
export default CauHoiKeoTha;
