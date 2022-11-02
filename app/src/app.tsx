import { AppLayout, AppRouter } from '@/src/components';
import { ConfigProvider } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import * as React from 'react';
import { Provider } from 'react-redux';
import routes from './auto-routes';
interface AppProps {
  createConfig: CreateConfig;
}

export default class App extends React.Component<AppProps> {
  render(): JSX.Element {
    return (
      <ConfigProvider locale={viVN}>
        <Provider store={$store}>
          <AppLayout createConfig={this.props.createConfig}>
            <AppRouter routes={routes} />
          </AppLayout>
        </Provider>
      </ConfigProvider>
    );
  }
}
