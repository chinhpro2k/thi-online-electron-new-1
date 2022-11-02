import React from 'react';
import { shell } from 'electron';
import './about.less';
export default class About extends React.Component {
    render() {
        return (React.createElement("div", { className: "about flex column center", style: { height: '100%' } },
            React.createElement("img", { src: $tools.APP_ICON, width: "88" }),
            React.createElement("h2", { style: { marginTop: 8 } }, $tools.APP_NAME),
            React.createElement("p", { className: "fs-12", style: { margin: 4 } },
                "Version ",
                $tools.APP_VERSION),
            React.createElement("p", { className: "fs-12 text-gray" },
                "Copyright \u00A9 ",
                new Date().getFullYear(),
                ' ',
                React.createElement("a", { onClick: () => {
                        shell.openExternal('https://github.com/lanten');
                    } }, "lanten."),
                ' ',
                "All rights (demo)")));
    }
} // class About end
