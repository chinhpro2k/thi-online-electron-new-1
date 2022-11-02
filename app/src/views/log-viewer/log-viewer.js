import React from 'react';
import $c from 'classnames';
import { LogReader } from './log-reader';
import './log-viewer.less';
export default class LogViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logFiles: [],
            activeFile: {},
            logDetail: [],
        };
        this.logReader = new LogReader();
        this.logDetailRef = React.createRef();
        this.TYPE_COLORS = {
            info: 'text-info',
            warn: 'text-warn',
            error: 'text-error',
        };
        /** 渲染日志行 */
        this.renderLogLine = (v, i) => {
            const color = this.TYPE_COLORS[v.type];
            return (React.createElement("p", { key: i, className: "text-gray" },
                v.date && (React.createElement("span", null,
                    "[",
                    React.createElement("span", { className: "text-purple" }, v.date),
                    "]")),
                v.type && (React.createElement("span", null,
                    "[",
                    React.createElement("span", { className: color }, v.type),
                    "]")),
                v.env && (React.createElement("span", null,
                    "[",
                    React.createElement("span", { className: "text-gray" }, v.env),
                    "]")),
                React.createElement("span", { className: "text-light" },
                    " \u00A0",
                    v.message)));
        };
        this.state.logFiles = this.logReader.getLogFiles();
    }
    componentDidMount() {
        const { logFiles } = this.state;
        this.openLogFile(logFiles[0]);
    }
    render() {
        const { logFiles, activeFile, logDetail } = this.state;
        return (React.createElement("div", { className: "flex log-viewer" },
            React.createElement("ul", { className: "log-list" }, logFiles.map((v) => (React.createElement("li", { key: v.name, className: $c({ active: v.name === activeFile.name }), onClick: () => activeFile.name !== v.name && this.openLogFile(v) }, v.name)))),
            React.createElement("code", { className: "log-detail flex-1", ref: this.logDetailRef }, logDetail.map(this.renderLogLine))));
    }
    /** 打开并监听日志文件 */
    openLogFile(file) {
        this.setState({ activeFile: file, logDetail: [] }, () => {
            this.logReader.openLogFile(file, (detail) => {
                this.setState({ logDetail: this.state.logDetail.concat(detail) }, () => {
                    const { current: detailDom } = this.logDetailRef;
                    if (detailDom) {
                        detailDom.scrollTop = detailDom.scrollHeight;
                    }
                });
            });
        });
    }
} // class LogViewer end
