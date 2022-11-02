const routes = [
    {
        key: 'Home',
        path: '/',
        redirect: { to: '/thionline?form=home' },
        windowOptions: {
            title: 'Hệ thống thi trực tuyến',
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
        },
        createConfig: {
            showSidebar: true,
            saveWindowBounds: true,
            // openDevTools: true,
        },
    },
];
export default routes;
