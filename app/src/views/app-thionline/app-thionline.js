import { __awaiter, __decorate } from "tslib";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { withStore } from '@/core/store';
import { Proctor } from '@/src/components/app-proctor/app-proctor';
import { UserInfo } from '@/src/components/user-info';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Modal, message, Row, Spin, Table } from 'antd';
import React from 'react';
import { ChonLichThi } from './chonlichthi';
import { LamBai } from './lambai';
import './index.less';
let AppThiOnline = class AppThiOnline extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false,
            dsMonHoc: [],
            modalChonLichThi: false,
            dsLichThi: [],
            loadingGiamSat: true,
        };
        this.handleXemLichThi = (lopHoc) => {
            console.log('first', lopHoc);
            this.setState({ loading: true });
            $api
                .getDanhSachLichThi({
                page: 1,
                limit: 1000,
                cond: {},
                maKyHoc: '20212-VLVH',
                maMonHoc: lopHoc.maMonHoc,
            }, { method: 'GET' })
                .then((data) => {
                var _a;
                console.log(`data`, data);
                this.setState({
                    dsLichThi: (_a = data.data
                        .map((val, i) => (Object.assign(Object.assign({}, val), { index: i + 1 })))) === null || _a === void 0 ? void 0 : _a.filter((x) => (x === null || x === void 0 ? void 0 : x.trangThai) === 'Đã duyệt'),
                    modalChonLichThi: true,
                });
            })
                .catch((e) => {
                console.log(`e`, e);
                message.error('Thao tác gặp lỗi');
            })
                .finally(() => {
                this.setState({ loading: false });
            });
        };
        this.xacNhanVaoThi = (lichThi) => {
            if ($tools.getUserObject().anhDaiDien) {
                this.handleVaoThi(lichThi);
                return;
            }
            Modal.confirm({
                className: 'modal-xac-nhan-thi',
                title: 'Xác nhận làm bài thi không có ảnh đại diện.',
                content: 'Bạn chưa có ảnh đại diện. Xác nhận làm bài thi không có ảnh đại diện?',
                onOk: () => this.handleVaoThi(lichThi),
            });
        };
        this.handleVaoThi = (lichThi) => {
            var _a, _b;
            this.setState({ loading: true });
            (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                type: 'ACTION_SAVE_LOGS',
                data: [],
            });
            $api
                .getDeThi(lichThi._id, { method: 'GET' })
                .then((data) => {
                var _a, _b;
                // console.log('data :>> ', data);
                (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                    type: 'ACTION_SAVE_TRANGTHAITHI',
                    data: {
                        dangThi: true,
                        thoiGianBatDau: lichThi.ngayGioThi,
                        thoiGianKetThuc: lichThi.ngayGioThiKetThuc,
                        deThi: data === null || data === void 0 ? void 0 : data.data,
                        maLopThi: lichThi.maLopHoc,
                        nganHangDeId: lichThi._id,
                    },
                });
            })
                .catch((e) => {
                console.log(`e`, e);
                message.error('Thao tác gặp lỗi');
            })
                .finally(() => {
                this.setState({ loading: false });
            });
            this.handleCloseModal();
            // TODO: xu ly vao thi
            // console.log('handle vào thi', lichThi);
        };
        this.handleThoatBaiThi = () => {
            var _a, _b, _c, _d;
            (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                type: 'ACTION_SAVE_TRANGTHAITHI',
                data: undefined,
            });
            (_d = (_c = this.props).dispatch) === null || _d === void 0 ? void 0 : _d.call(_c, {
                type: 'ACTION_SAVE_LOGS',
                data: [],
            });
        };
        this.handleCloseModal = () => {
            this.setState({
                modalChonLichThi: false,
            });
        };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState({ loading: true });
            $api
                .getDanhSachMonHoc({ page: 1, limit: 1000, cond: {}, maKyHoc: '20212-VLVH' }, { method: 'GET' })
                .then((data) => {
                this.setState({
                    dsMonHoc: data.data
                        .filter((s) => !!s.coLichThi)
                        .map((val, i) => (Object.assign(Object.assign({}, val), { index: i + 1, key: i + 1 }))),
                });
            })
                .finally(() => {
                this.setState({ loading: false });
            });
        });
    }
    componentWillUnmount() {
        // console.log('Appthionline unmount');
        this.handleThoatBaiThi();
    }
    render() {
        var _a, _b;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const renderLast = (value, record) => (React.createElement(React.Fragment, null,
            React.createElement(Button, { type: "primary", icon: React.createElement(SearchOutlined, null), onClick: () => this.handleXemLichThi(record) }, "Xem l\u1ECBch thi")));
        const columns = [
            {
                title: 'STT',
                dataIndex: 'index',
                align: 'center',
                width: 80,
            },
            {
                title: 'Tên học phần',
                dataIndex: 'tenMonHoc',
                //   search: 'search',
                align: 'center',
                //    width: 400,
            },
            {
                title: 'Mã học phần',
                dataIndex: 'maMonHoc',
                align: 'center',
                width: 200,
            },
            {
                title: 'Số tín chỉ',
                dataIndex: 'soTinChi',
                width: 150,
                align: 'center',
            },
            {
                title: 'Thao tác',
                align: 'center',
                render: (value, record) => renderLast(value, record),
                fixed: 'right',
                width: 160,
            },
        ];
        const { modalChonLichThi } = this.state;
        const { trangThaiThi, logs, user, dispatch } = this.props;
        let ConditonalBlock;
        if (!!(trangThaiThi === null || trangThaiThi === void 0 ? void 0 : trangThaiThi.dangThi)) {
            console.log(`trangThaiThi`, trangThaiThi);
            ConditonalBlock = (React.createElement(Spin, { spinning: this.state.loadingGiamSat && !((_a = trangThaiThi === null || trangThaiThi === void 0 ? void 0 : trangThaiThi.deThi) === null || _a === void 0 ? void 0 : _a.daLam), tip: "\u0110ang c\u00E0i \u0111\u1EB7t ph\u1EA7n m\u1EC1m gi\u00E1m s\u00E1t.." },
                React.createElement(Row, null,
                    React.createElement(Col, { xs: 24, md: 12, lg: 18 },
                        React.createElement(LamBai, { logs: logs, dispatch: dispatch, deThi: trangThaiThi === null || trangThaiThi === void 0 ? void 0 : trangThaiThi.deThi, onThoat: this.handleThoatBaiThi, maLopThi: trangThaiThi.maLopThi, nganHangDeId: trangThaiThi.nganHangDeId, thoiGianBatDau: trangThaiThi.thoiGianBatDau, thoiGianKetThuc: trangThaiThi.thoiGianKetThuc })),
                    React.createElement(Col, { xs: 24, md: 12, lg: 6 }, !!((_b = trangThaiThi === null || trangThaiThi === void 0 ? void 0 : trangThaiThi.deThi) === null || _b === void 0 ? void 0 : _b.daLam) ? (React.createElement("div", null)) : (React.createElement("div", null,
                        React.createElement(UserInfo, { user: user, dispatch: this.props.dispatch }),
                        React.createElement(Proctor, { onReady: () => {
                                this.setState({ loadingGiamSat: false });
                            } })))))));
        }
        else
            ConditonalBlock = (React.createElement(Row, { gutter: 24 },
                React.createElement(Col, { xs: 24, md: 12, lg: 18 },
                    React.createElement(Spin, { spinning: this.state.loading },
                        React.createElement(Drawer, { title: "Ch\u1ECDn l\u1ECBch thi", visible: modalChonLichThi, destroyOnClose: true, width: "60%", bodyStyle: { backgroundColor: 'white' }, onClose: () => this.handleCloseModal(), footer: React.createElement("div", { style: {
                                    textAlign: 'right',
                                } },
                                React.createElement(Button, { onClick: () => this.handleCloseModal(), style: { marginRight: 8 } }, "\u0110\u00F3ng")) },
                            React.createElement(ChonLichThi, { dsLichThi: this.state.dsLichThi, onVaoThi: this.xacNhanVaoThi })),
                        React.createElement(Table, { columns: columns, dataSource: this.state.dsMonHoc }))),
                React.createElement(Col, { xs: 24, md: 12, lg: 6 },
                    React.createElement(UserInfo, { user: user, dispatch: this.props.dispatch }))));
        return React.createElement("div", null, ConditonalBlock);
    }
};
AppThiOnline = __decorate([
    withStore(['trangThaiThi', 'logs', 'user'])
], AppThiOnline);
export default AppThiOnline;
