import { __rest } from "tslib";
import * as pageResource from '@/src/page-resource';
import { remote } from 'electron';
import React from 'react';
import { HashRouter as Router, Redirect, Route, Switch, } from 'react-router-dom';
import { asyncImport } from '../async-import';
import { beforeRouter } from './router-hooks';
const currentWindow = remote.getCurrentWindow();
export class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            readyToClose: false,
        };
        this.creatRoute = (routeConfig, key) => {
            const { path, exact = true, redirect } = routeConfig, params = __rest(routeConfig, ["path", "exact", "redirect"]);
            const routeProps = { key, name: key, path, exact };
            if (redirect) {
                routeProps.render = (props) => (React.createElement(Redirect, Object.assign({}, redirect, props)));
            }
            else {
                const resource = pageResource[key];
                if (!resource)
                    return;
                const Comp = resource.constructor === Promise
                    ? asyncImport(resource, beforeRouter)
                    : resource;
                routeProps.render = (props) => {
                    const nextProps = Object.assign(Object.assign({ name: key, currentWindow, closeWindow: this.closeWindow, query: $tools.getQuery(props.location.search) }, props), params);
                    return React.createElement(Comp, Object.assign({}, nextProps));
                };
            }
            // console.log('routeProps :>> ', routeProps);
            return React.createElement(Route, Object.assign({}, routeProps));
        };
        this.closeWindow = () => {
            this.setState({ readyToClose: true }, () => {
                currentWindow.close();
            });
        };
        this.routeElements = this.createRoutes();
        // 保证组件正常卸载,防止 Redux 内存泄露
        window.onbeforeunload = () => {
            this.setState({ readyToClose: true });
        };
    }
    render() {
        var _a;
        const { readyToClose } = this.state;
        if (readyToClose)
            return null;
        return (React.createElement(Router, null,
            React.createElement(Switch, null,
                this.routeElements, (_a = this.noMatch) !== null && _a !== void 0 ? _a : null)));
    }
    createRoutes() {
        const { routes } = this.props;
        const res = [];
        routes.forEach((conf, key) => {
            // Nếu chưa login thì chỉ hiện mỗi "/user-info"
            // console.log('conf, key :>> ', conf.path, $tools.getAccessToken());
            // if (
            //   !$tools.getAccessToken() &&
            //   conf.key !== 'Dashboard' &&
            //   conf.path !== '/'
            // )
            //   return;
            // else console.log('conf, key :>> ', conf.path, $tools.getAccessToken());
            const routeEl = this.creatRoute(conf, key);
            if (!routeEl)
                return;
            if (conf.path) {
                res.push(routeEl);
            }
            else {
                this.noMatch = routeEl;
            }
        });
        return res;
    }
}
AppRouter.defaultProps = {
    routes: [],
};
