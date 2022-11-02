import React from 'react';
import { Button } from 'antd';
import './alert-modal.less';
const TYPES_CONFIG = {
    info: {
        icon: React.createElement("i", { className: "fs-48 text-info ri-information-fill" }),
    },
    warn: {
        icon: React.createElement("i", { className: "fs-48 text-warn ri-alert-fill" }),
    },
    error: {
        icon: React.createElement("i", { className: "fs-48 text-error ri-close-circle-fill" }),
    },
};
export default class AlertModal extends React.Component {
    get typesConfig() {
        const { type } = this.props.query;
        return TYPES_CONFIG[type || 'info'];
    }
    render() {
        const { title, message } = this.props.query;
        return (React.createElement("div", { className: "alert-modal flex column" },
            React.createElement("div", { className: "content flex-1 flex pl-16 pr-16 pb-16" },
                React.createElement("div", { className: "mr-16 mt-8 drag" }, this.typesConfig.icon),
                React.createElement("div", { className: "flex-1 flex column" },
                    React.createElement("h1", { className: "fs-24 text-title pt-16 drag" }, title),
                    React.createElement("p", { className: "fs-14 text-gray flex-1 message-box" }, message))),
            React.createElement("div", { className: "footer flex end" },
                React.createElement(Button, { type: "primary", onClick: () => {
                        this.props.closeWindow();
                    } }, "close"))));
    }
} // class AlertModal end
