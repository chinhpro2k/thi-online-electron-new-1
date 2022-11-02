const routes: RouteConfig[] = [
  {
    key: 'Dashboard',
    path: '/dashboard',
    windowOptions: {
      title: 'Trang chủ',
      resizable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      width: 300,
      height: 240,
      vibrancy: 'fullscreen-ui',
    },
    createConfig: {
      showTitlebar: true,
    },
  },
];

export default routes;
