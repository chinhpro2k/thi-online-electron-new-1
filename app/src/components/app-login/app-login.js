import { __awaiter } from "tslib";
import { Button, Col, Form, Input, message, Row, Spin, Typography } from 'antd';
import React from 'react';
import LoginWithKeycloak from '@/src/components/app-login-with-keycloak';
const { Title } = Typography;
export class AppLogin extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            loading: false,
        };
        this.onPressTaiKhoan = (e) => {
            const specialCharRegex = /[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF]/;
            if (!specialCharRegex.test(e.key)) {
                e.preventDefault();
                return false;
            }
        };
    }
    render() {
        const { onDone } = this.props;
        const onFinish = (values) => {
            this.setState({ loading: true });
            $api
                .login({ username: values.username, password: values.password })
                .then((resData) => {
                console.log('data', resData);
                $tools.setAccessToken(resData.accessToken);
                $tools.setUserObject(resData.user);
                onDone(resData.data);
            })
                .catch(() => {
                message.error('Tài khoản hoặc mật khẩu không chính xác');
            })
                .finally(() => {
                this.setState({ loading: false });
            });
        };
        const onFinishFailed = (errorInfo) => {
            // console.log('Failed:', errorInfo);
        };
        const handleLoginWithKeycloak = (accessToken) => __awaiter(this, void 0, void 0, function* () {
            console.log('login', accessToken);
        });
        const { loading } = this.state;
        return (React.createElement(Row, { justify: "center", align: "middle", style: { height: '100%', margin: 'auto' } },
            React.createElement(Col, { xs: 20, md: 12, lg: 8, style: { textAlign: 'center' } },
                React.createElement("img", { src: $tools.PTIT_LOGO, alt: "", style: { height: '120px', marginBottom: '20px' } }),
                React.createElement(Title, { level: 2 }, "H\u1EC7 th\u1ED1ng thi tr\u1EF1c tuy\u1EBFn"),
                React.createElement(Spin, { spinning: loading },
                    React.createElement(Form, { name: "basic", labelCol: {
                            span: 8,
                        }, wrapperCol: {
                            span: 16,
                        }, initialValues: {
                            remember: true,
                        }, onFinish: onFinish, onFinishFailed: onFinishFailed, style: { marginRight: '18px' } },
                        React.createElement(Form.Item, { label: "T\u00E0i kho\u1EA3n", name: "username", rules: [
                                {
                                    required: true,
                                    message: 'Hãy nhập tài khoản!',
                                },
                            ] },
                            React.createElement(Input, { onKeyPress: this.onPressTaiKhoan })),
                        React.createElement(Form.Item, { label: "M\u1EADt kh\u1EA9u", name: "password", rules: [
                                {
                                    required: true,
                                    message: 'Hãy nhập mật khẩu!',
                                },
                            ] },
                            React.createElement(Input.Password, null)),
                        React.createElement(Form.Item, { wrapperCol: {
                                span: 24,
                            } },
                            React.createElement(Button, { type: "primary", htmlType: "submit", style: { marginLeft: '18px' } }, "\u0110\u0103ng nh\u1EADp"),
                            React.createElement(LoginWithKeycloak, { title: "\u0110\u0103ng nh\u1EADp v\u1EDBi Slink ID", onLoginSuccess: handleLoginWithKeycloak })))))));
    }
}
