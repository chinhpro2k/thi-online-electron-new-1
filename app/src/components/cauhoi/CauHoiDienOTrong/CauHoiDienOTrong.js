import { Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { decodeCauHoi, getIndexFromPlaceholder, isAnswerPlaceholder, } from '../utils';
const CauHoiDienOTrong = (props) => {
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
    const updateAnswer = (index, e) => {
        var _a;
        const updatedAnswereds = answereds.map((answer, i) => {
            return i === index ? e.target.value : answer;
        });
        setAnswereds(updatedAnswereds);
        (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, updatedAnswereds);
    };
    return (React.createElement("div", { style: { marginTop: '10px' } }, decodeCauHoi(props.cauHoi.noiDung.cauHoi).map((item, index) => {
        if (!isAnswerPlaceholder(item)) {
            return (React.createElement("span", { style: { display: 'inline' }, key: index }, item));
        }
        const answerIndex = getIndexFromPlaceholder(item);
        return (React.createElement(Input, { maxLength: 100, value: answereds[answerIndex], onChange: (e) => updateAnswer(answerIndex, e), size: "small", key: index, style: { width: '80px' } }));
    })));
};
export default CauHoiDienOTrong;
