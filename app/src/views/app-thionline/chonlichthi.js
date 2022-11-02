/* eslint-disable indent */
/* eslint-disable react/prop-types */
import { Button, List, Empty, Typography, Skeleton } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
export const ChonLichThi = ({ dsLichThi, onVaoThi, }) => {
    const [time, setTimer] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (React.createElement("div", null, dsLichThi.length === 0 ? (React.createElement(Empty, null)) : (React.createElement(List
    // header={<div>Header</div>}
    // footer={<div>Footer</div>}
    , { 
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered: true, dataSource: dsLichThi, renderItem: (lichThi, index) => (React.createElement(List.Item, { actions: [
                !!lichThi.daLam ? (React.createElement(Button, { type: "dashed", danger: true }, "\u0110\u00E3 l\u00E0m b\u00E0i")) : !moment().isBetween(moment(lichThi.ngayGioThi), moment(lichThi.ngayGioThiKetThuc)) ? (React.createElement(Button, { type: "dashed", danger: true }, "Ngo\u00E0i gi\u1EDD thi")) : (React.createElement(Button, { onClick: () => onVaoThi(lichThi) }, "V\u00E0o thi")),
            ] },
            React.createElement(Skeleton, { avatar: true, title: false, loading: false, active: true },
                React.createElement(List.Item.Meta, { title: React.createElement("div", null,
                        " ",
                        lichThi.tenDe,
                        " "), description: React.createElement(Typography.Text, null, `Thời gian: ${moment(lichThi.ngayGioThi).format('DD/MM/YYYY HH:mm')} đến ${moment(lichThi.ngayGioThiKetThuc).format('DD/MM/YYYY HH:mm')}.  Mã môn học: ${lichThi.maMonHoc} `) })))) }))));
};
