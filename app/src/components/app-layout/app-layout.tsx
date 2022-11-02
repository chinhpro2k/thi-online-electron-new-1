import { withStore } from '@/core/store';
import $c from 'classnames';
import React from 'react';
import { AppSidebar, AppTitlebar } from '../';
import { AppLogin } from '../app-login';
import './app-layout.less';
import humps from 'humps';
import User = UserInfoNS.User;

interface AppLayoutProps extends Partial<StoreProps> {
  createConfig: CreateConfig;
  children: JSX.Element;
  user?: StoreStates['user'];
}

@withStore(['user'])
export class AppLayout extends React.Component<AppLayoutProps> {
  onLoginSuccessFul = (userInfo: UserInfoNS.RootObject): void => {
    const userInfoCamel = humps.camelizeKeys(userInfo.user);
    this.props?.dispatch?.({
      type: 'ACTION_SAVE_USER',
      data: userInfoCamel as User,
    });
  };

  render(): JSX.Element {
    const { createConfig } = this.props;

    const { user } = this.props;
    let ConditionalBlock: JSX.Element;
    if (!user || !user?.hoTen || !user?.maDinhDanh)
      ConditionalBlock = (
        <div className="flex-1 app-content-wrap">
          <AppTitlebar />
          <AppLogin onDone={this.onLoginSuccessFul} />
        </div>
      );
    else
      ConditionalBlock = (
        <>
          {/* {createConfig.showSidebar ? <AppSidebar /> : null} */}
          <div className="flex-1 app-content-wrap">
            {createConfig.showTitlebar ? <AppTitlebar /> : null}
            <div className="app-content">{this.props.children}</div>
          </div>
        </>
      );

    return (
      <div
        className={$c(
          'flex app-layout',
          {
            'has-titlebar': createConfig.showTitlebar,
            'has-sidebar': createConfig.showSidebar,
          },
          process.platform
        )}
      >
        {ConditionalBlock}
      </div>
    );
  }
} // class AppLayout end
