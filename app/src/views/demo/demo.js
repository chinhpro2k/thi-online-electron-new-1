import { __decorate } from "tslib";
import * as React from 'react';
import { Button, Input, Spin, Card } from 'antd';
import { withStore } from '@/core/store';
let Demo = class Demo extends React.Component {
    // 构造函数
    constructor(props) {
        super(props);
        // state 初始化
        this.state = {
            resData: {},
            loading: false,
            createWindowLoading: false,
            asyncDispatchLoading: false,
        };
        this.asyncDispatch = (dispatch) => {
            return new Promise((resolve) => {
                this.setState({ asyncDispatchLoading: true });
                setTimeout(() => {
                    const { count } = this.props;
                    dispatch({ type: 'ACTION_ADD_COUNT', data: count + 1 });
                    this.setState({ asyncDispatchLoading: false });
                    resolve();
                }, 1000);
            });
        };
        this.openNewWindow = () => {
            this.setState({ createWindowLoading: true });
            $tools
                .createWindow('Demo')
                .finally(() => this.setState({ createWindowLoading: false }));
        };
    }
    componentDidMount() {
        // console.log(this);
    }
    render() {
        const { resData, loading, createWindowLoading, asyncDispatchLoading } = this.state;
        const { count: reduxCount, countAlias } = this.props;
        return (React.createElement("div", { className: "layout-padding" },
            React.createElement(Card, { title: "Redux Test", className: "mb-16" },
                React.createElement("p", null,
                    "redux count : ",
                    reduxCount),
                React.createElement("p", null,
                    "redux countAlias : ",
                    countAlias),
                React.createElement("div", { className: "mt-16" },
                    React.createElement(Button, { type: "primary", onClick: () => {
                            this.props.dispatch({
                                type: 'ACTION_ADD_COUNT',
                                data: reduxCount + 1,
                            });
                        } }, "Add"),
                    React.createElement(Button, { className: "ml-16", type: "primary", onClick: () => {
                            this.props.dispatch({
                                type: 'ACTION_ADD_COUNT',
                                data: countAlias + 1,
                            });
                        } }, "Add (alias)"),
                    React.createElement(Button, { className: "ml-16", type: "primary", loading: asyncDispatchLoading, onClick: () => {
                            this.props.dispatch(this.asyncDispatch);
                        } }, "Add (async)")),
                React.createElement("p", { className: "text-gray mt-16 mb-16" }, "Redux runs in the main process, which means it can be shared across all renderer processes."),
                React.createElement(Button, { onClick: this.openNewWindow, loading: createWindowLoading }, "Open new window")),
            React.createElement(Card, { title: "Request Test", className: "mb-16" },
                React.createElement(Spin, { spinning: loading },
                    React.createElement("div", { className: "mb-16" },
                        React.createElement(Button, { type: "primary", onClick: this.requestTest.bind(this) }, "Request"),
                        React.createElement(Button, { className: "ml-16", type: "primary", onClick: this.requestTestError.bind(this) }, "Request Error (notification)"),
                        React.createElement(Button, { className: "ml-16", type: "primary", onClick: this.requestTestErrorModal.bind(this) }, "Request Error (modal)")),
                    React.createElement(Input.TextArea, { value: JSON.stringify(resData), autoSize: true })))));
    }
    requestTest() {
        this.setState({ loading: true });
        $api
            .queryTestInfo({})
            .then((resData) => {
            this.setState({ resData });
        })
            .finally(() => this.setState({ loading: false }));
    }
    requestTestError() {
        this.setState({ loading: true });
        $api
            .queryTestInfoError({})
            .catch((resData) => {
            this.setState({ resData });
        })
            .finally(() => this.setState({ loading: false }));
    }
    requestTestErrorModal() {
        this.setState({ loading: true });
        $api
            .queryTestInfoError({}, { errorType: 'modal' })
            .catch((resData) => {
            this.setState({ resData });
        })
            .finally(() => this.setState({ loading: false }));
    }
}; // class Demo end
Demo = __decorate([
    withStore(['count', { countAlias: 'count' }])
], Demo);
export default Demo;
