import * as React from 'react';
import { Button, Result } from 'antd';
import './no-match.less';
export default class ErrorPage extends React.Component {
    render() {
        return (React.createElement("div", { className: "layout-padding flex column center no-match" },
            React.createElement(Result, { status: "404", title: "404", subTitle: React.createElement("p", { className: "text-default" }, "Sorry, the page you visited does not exist."), extra: React.createElement(Button, { type: "primary", onClick: () => history.go(-1) }, "Back") })));
    }
} // class ErrorPage end
