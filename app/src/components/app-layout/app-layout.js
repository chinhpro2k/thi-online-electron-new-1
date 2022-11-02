import { __decorate } from "tslib";
import { withStore } from '@/core/store';
import $c from 'classnames';
import React from 'react';
import { AppTitlebar } from '../';
import { AppLogin } from '../app-login';
import './app-layout.less';
let AppLayout = class AppLayout extends React.Component {
    constructor() {
        super(...arguments);
        this.onLoginSuccessFul = (userInfo) => {
            var _a, _b;
            console.log('user info', userInfo.user);
            (_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.dispatch) === null || _b === void 0 ? void 0 : _b.call(_a, {
                type: 'ACTION_SAVE_USER',
                data: userInfo.user,
            });
        };
    }
    render() {
        const { createConfig } = this.props;
        const { user } = this.props;
        let ConditionalBlock;
        if (!user || !(user === null || user === void 0 ? void 0 : user.hoTen) || !(user === null || user === void 0 ? void 0 : user.maSv))
            ConditionalBlock = (React.createElement("div", { className: "flex-1 app-content-wrap" },
                React.createElement(AppTitlebar, null),
                React.createElement(AppLogin, { onDone: this.onLoginSuccessFul })));
        else
            ConditionalBlock = (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "flex-1 app-content-wrap" },
                    createConfig.showTitlebar ? React.createElement(AppTitlebar, null) : null,
                    React.createElement("div", { className: "app-content" }, this.props.children))));
        return (React.createElement("div", { className: $c('flex app-layout', {
                'has-titlebar': createConfig.showTitlebar,
                'has-sidebar': createConfig.showSidebar,
            }, process.platform) }, ConditionalBlock));
    }
}; // class AppLayout end
AppLayout = __decorate([
    withStore(['user'])
], AppLayout);
export { AppLayout };
