import React from 'react';
import LuaChon from './LuaChon';
const backgroundColors = ['#18963a', '#1f5fad', '#a82e25', '#7024a6'];
const DanhSachLuaChon = (props) => {
    return (React.createElement("div", null, props.dsCauTraLoi.map((cauTraLoi, index) => {
        const isDisabled = !!props.answereds.find((answeredItem) => answeredItem === cauTraLoi.luaChon);
        return (React.createElement(LuaChon, { key: index, value: cauTraLoi.luaChon, backgroundColor: backgroundColors[index % backgroundColors.length], isDisabled: isDisabled }));
    })));
};
export default DanhSachLuaChon;
