import React from 'react';
export default class PageParams extends React.Component {
    get pageParams() {
        return JSON.stringify(this.props.match.params);
    }
    get pageQuery() {
        return JSON.stringify(this.props.query);
    }
    render() {
        return (React.createElement("div", { className: "page-params layout-padding" },
            React.createElement("p", null,
                "Params: ",
                this.pageParams),
            React.createElement("p", null,
                "Query: ",
                this.pageQuery)));
    }
} // class PageParams end
