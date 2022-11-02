import { AppLayout, AppRouter } from '@/src/components';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import * as React from 'react';
import { Provider } from 'react-redux';
import routes from './auto-routes';
export default class App extends React.Component {
    render() {
        return (React.createElement(ConfigProvider, { locale: viVN },
            React.createElement(Provider, { store: $store },
                React.createElement(AppLayout, { createConfig: this.props.createConfig },
                    React.createElement(AppRouter, { routes: routes })))));
    }
}
