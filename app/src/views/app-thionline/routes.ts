const routes: RouteConfig[] = [
  {
    key: 'ThiOnline',
    path: '/thionline',
    windowOptions: {
      title: 'Thi Trực Tuyến',
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
