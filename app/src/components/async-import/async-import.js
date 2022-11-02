import * as React from 'react';
export function asyncImport(importComponent, hook) {
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = { comp: null };
        }
        componentDidMount() {
            importComponent.then(({ default: comp }) => {
                const next = () => this.setState({ comp });
                if (hook) {
                    const hookRes = hook(this.props, next);
                    if (typeof hookRes === 'boolean' && hookRes) {
                        next();
                    }
                }
                else {
                    this.setState({ comp });
                }
            });
        }
        render() {
            const { comp: Comp } = this.state;
            return Comp ? React.createElement(Comp, Object.assign({}, this.props)) : null;
        }
    }
    return AsyncComponent;
}
