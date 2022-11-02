import React from 'react';
import { Tooltip } from 'antd';
import AppSideMenus from './side-menus.json';
import './app-sidebar.less';
export class AppSidebar extends React.Component {
    constructor() {
        var _a;
        super(...arguments);
        this.state = {
            activeMenuKey: (_a = AppSideMenus[0]) === null || _a === void 0 ? void 0 : _a.key,
        };
        this.onRouterUpdate = (e) => {
            const routeProps = e.detail;
            this.setState({ activeMenuKey: routeProps.name });
        };
        this.renderMenuItem = ({ key, icon, title, href }) => {
            const { activeMenuKey } = this.state;
            const isActive = activeMenuKey === key;
            // if (!$tools.getAccessToken() && key !== 'Dashboard') return <></>;
            return (React.createElement(Tooltip, { key: key, overlayClassName: "side-menu-item-tooltip", placement: "right", title: title },
                React.createElement("a", { className: `side-menu-item fs-24 ri-${icon}-${isActive ? 'fill' : 'line'}`, style: { color: isActive ? '#fff' : '' }, href: href })));
        };
    }
    componentDidMount() {
        window.addEventListener('router-update', this.onRouterUpdate);
    }
    render() {
        return (React.createElement("div", { className: "app-sidebar" },
            React.createElement("div", { className: "flex center app-sidebar-header" },
                React.createElement("img", { width: "40", src: $tools.PTIT_APP_ICON })),
            React.createElement("div", { className: "flex column side-menu" }, AppSideMenus.map(this.renderMenuItem))));
    }
    componentWillUnmount() {
        window.removeEventListener('router-update', this.onRouterUpdate);
    }
} // class AppSidebar end
