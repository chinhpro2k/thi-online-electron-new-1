import React from 'react';
import { remote } from 'electron';
import './app-titlebar.less';
export class AppTitlebar extends React.Component {
    constructor() {
        super(...arguments);
        this.currentWindow = remote.getCurrentWindow();
        this.state = {
            routeProps: {},
            maximized: this.currentWindow.isMaximized(),
        };
        this.onRouterUpdate = (e) => {
            const routeProps = e.detail;
            this.setState({ routeProps });
        };
        this.onMaximize = () => {
            this.setState({ maximized: true });
        };
        this.onUnmaximize = () => {
            this.setState({ maximized: false });
        };
    }
    componentDidMount() {
        window.addEventListener('router-update', this.onRouterUpdate);
        this.currentWindow.on('maximize', this.onMaximize);
        this.currentWindow.on('unmaximize', this.onUnmaximize);
    }
    renderWindowController() {
        const { routeProps, maximized } = this.state;
        // 最大化按钮
        const maxSizeBtn = this.currentWindow.isMaximizable() ? (maximized ? (React.createElement("div", { className: "titlebar-btn", onClick: () => this.currentWindow.unmaximize() },
            React.createElement("i", { className: "ri-checkbox-multiple-blank-line fs-14" }))) : (React.createElement("div", { className: "titlebar-btn", onClick: () => this.currentWindow.maximize() },
            React.createElement("i", { className: "ri-checkbox-blank-line fs-14" })))) : (void 0);
        return (React.createElement("div", { className: "titlebar-controller flex" },
            this.currentWindow.isMinimizable() && (React.createElement("div", { className: "titlebar-btn", onClick: () => this.currentWindow.minimize() },
                React.createElement("i", { className: "ri-subtract-line fs-16" }))),
            maxSizeBtn,
            this.currentWindow.isClosable() && (React.createElement("div", { className: "titlebar-btn titlebar-btn-close", onClick: routeProps.closeWindow },
                React.createElement("i", { className: "ri-close-line fs-18" })))));
    }
    render() {
        var _a;
        const { routeProps } = this.state;
        return (React.createElement("header", { className: "app-titlebar flex center-v" },
            React.createElement("div", { className: "flex-1 title-content drag flex center-v", style: { width: 0 } },
                React.createElement("p", { className: "text-ellipsis" }, (_a = routeProps.currentWindow) === null || _a === void 0 ? void 0 : _a.title)),
            process.platform !== 'darwin' && this.renderWindowController()));
    }
    componentWillUnmount() {
        // 移除事件监听
        window.removeEventListener('router-update', this.onRouterUpdate);
        this.currentWindow.removeListener('maximize', this.onMaximize);
        this.currentWindow.removeListener('unmaximize', this.onUnmaximize);
    }
} // class AppTitlebar end
