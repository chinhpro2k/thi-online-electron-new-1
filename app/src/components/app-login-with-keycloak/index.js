import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
const LoginWithKeycloak = ({ title, onLoginSuccess, }) => {
    const { keycloak } = useKeycloak();
    const login = useCallback(() => {
        keycloak === null || keycloak === void 0 ? void 0 : keycloak.login();
    }, [keycloak]);
    useEffect(() => {
        var _a;
        if (keycloak.authenticated)
            onLoginSuccess((_a = keycloak === null || keycloak === void 0 ? void 0 : keycloak.token) !== null && _a !== void 0 ? _a : '');
    }, [keycloak.authenticated]);
    return (React.createElement("div", null,
        React.createElement(Button, { onClick: login, type: "primary", style: {
                marginTop: 8,
                width: '100%',
            }, size: "large" }, title)));
};
export default LoginWithKeycloak;
