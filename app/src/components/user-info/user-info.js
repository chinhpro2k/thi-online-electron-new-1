import { __decorate } from "tslib";
import { withStore } from '@/core/store';
import { Avatar, Button, Card, Col, Descriptions, Divider, Modal, Row, Typography, } from 'antd';
import * as React from 'react';
const { Title } = Typography;
let UserInfo = class UserInfo extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false,
        };
        this.onLoginSuccessFul = (userInfo) => {
            var _a, _b;
            (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                type: 'ACTION_SAVE_USER',
                data: userInfo.user,
            });
        };
        this.onLogout = () => {
            var _a;
            if ((_a = this.props.trangThaiThi) === null || _a === void 0 ? void 0 : _a.dangThi) {
                Modal.confirm({
                    className: 'modal-xac-nhan-thi',
                    title: 'Cảnh báo',
                    content: 'Bạn có chắc chắc muốn đăng xuất khỏi hệ thống? Nếu đăng xuất toàn bộ bài làm của bạn sẽ bị mất.',
                    okText: 'OK',
                    cancelText: 'Hủy',
                    onOk: this.handleLogout,
                });
            }
            else {
                this.handleLogout();
            }
        };
        this.handleLogout = () => {
            var _a, _b, _c, _d, _e, _f;
            (_b = (_a = this.props).dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                type: 'ACTION_SAVE_USER',
                data: undefined,
            });
            (_d = (_c = this.props).dispatch) === null || _d === void 0 ? void 0 : _d.call(_c, {
                type: 'ACTION_SAVE_TRANGTHAITHI',
                data: undefined,
            });
            (_f = (_e = this.props).dispatch) === null || _f === void 0 ? void 0 : _f.call(_e, {
                type: 'ACTION_SAVE_LOGS',
                data: [],
            });
            $tools.removeAccessToken();
        };
    }
    render() {
        const { user } = this.props;
        return (React.createElement(Row, { justify: "center", align: "middle" },
            React.createElement(Col, { xs: 24 },
                React.createElement(Card, { bordered: true },
                    React.createElement("div", null,
                        React.createElement(Row, { justify: "center", align: "middle" },
                            React.createElement(Col, null,
                                React.createElement("div", { style: { textAlign: 'center', marginBottom: 12 } },
                                    React.createElement(Avatar, { size: 128, src: user === null || user === void 0 ? void 0 : user.anhDaiDien })),
                                React.createElement(Title, { level: 3 }, user === null || user === void 0 ? void 0 : user.hoTen))),
                        React.createElement(Descriptions, { column: 1, title: "Th\u00F4ng tin sinh vi\u00EAn", bordered: true },
                            React.createElement(Descriptions.Item, { label: "M\u00E3 kh\u00F3a" }, user === null || user === void 0 ? void 0 : user.maKhoa),
                            React.createElement(Descriptions.Item, { label: "M\u00E3 sinh vi\u00EAn" }, user === null || user === void 0 ? void 0 : user.maSv))),
                    React.createElement(Divider, null),
                    React.createElement(Button, { type: "primary", danger: true, onClick: () => this.onLogout() }, "\u0110\u0103ng xu\u1EA5t")))));
    }
};
UserInfo = __decorate([
    withStore(['trangThaiThi'])
], UserInfo);
export { UserInfo };
