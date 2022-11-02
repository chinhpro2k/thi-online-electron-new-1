import React from 'react';

interface DashboardProps extends StoreProps {
  user: StoreStates['user'];
}

interface DashboardState {
  loading: boolean;
}

export default class Dashboard extends React.Component<
  DashboardProps,
  DashboardState
> {
  render(): JSX.Element {
    return <div>Trang chu</div>;
  }
} // class DB end
