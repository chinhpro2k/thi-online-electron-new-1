import * as pageResource from '@/src/page-resource';
import { remote } from 'electron';
import * as React from 'react';
import {
  HashRouter as Router,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import { asyncImport } from '../async-import';
import { beforeRouter } from './router-hooks';

interface AppRouterProps {
  routes: Map<string, RouteConfig>;
  // store: AppStore;
}

interface AppRouterState {
  readyToClose: boolean;
}

const currentWindow = remote.getCurrentWindow();

export class AppRouter extends React.Component<AppRouterProps, AppRouterState> {
  static defaultProps = {
    routes: [],
  };

  noMatch?: JSX.Element;
  routeElements: JSX.Element[];

  readonly state: AppRouterState = {
    readyToClose: false,
  };

  constructor(props: AppRouterProps) {
    super(props);
    this.routeElements = this.createRoutes();

    // 保证组件正常卸载,防止 Redux 内存泄露
    window.onbeforeunload = () => {
      this.setState({ readyToClose: true });
    };
  }

  render(): JSX.Element | null {
    const { readyToClose } = this.state;
    if (readyToClose) return null;
    return (
      <Router>
        <Switch>
          {this.routeElements}
          {this.noMatch ?? null}
        </Switch>
      </Router>
    );
  }

  createRoutes(): JSX.Element[] {
    const { routes } = this.props;
    const res: JSX.Element[] = [];

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
      if (!routeEl) return;
      if (conf.path) {
        res.push(routeEl);
      } else {
        this.noMatch = routeEl;
      }
    });

    return res;
  }

  creatRoute = (routeConfig: RouteConfig, key: string): JSX.Element | void => {
    const { path, exact = true, redirect, ...params } = routeConfig;
    const routeProps: any = { key, name: key, path, exact };

    if (redirect) {
      routeProps.render = (props: RouteComponentProps) => (
        <Redirect {...redirect} {...props} />
      );
    } else {
      const resource = pageResource[key];
      if (!resource) return;

      const Comp =
        resource.constructor === Promise
          ? asyncImport(resource, beforeRouter)
          : resource;

      routeProps.render = (props: RouteComponentProps) => {
        const nextProps = {
          name: key,
          currentWindow,
          closeWindow: this.closeWindow,
          query: $tools.getQuery(props.location.search),
          ...props,
          ...params,
        };
        return <Comp {...nextProps} />;
      };
    }
    // console.log('routeProps :>> ', routeProps);
    return <Route {...routeProps} />;
  };

  closeWindow = (): void => {
    this.setState({ readyToClose: true }, () => {
      currentWindow.close();
    });
  };
}
