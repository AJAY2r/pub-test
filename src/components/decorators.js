'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {VelocityComponent} from 'velocity-react';

const Loading = ({style}) => {
    return <div style={style}>loading...</div>;
};
Loading.propTypes = {
    style: PropTypes.object
};

const Toggle = ({props}) => {
    const { style, node, svgToggle } = props;
    const onClick = svgToggle ? props.onClick : '';
    const {height, width} = style;
    const midHeight = height * 0.5;
    const svgDisplay = node.hideArrow ? 'none' : '';
    const baseStyle = style.base;
    baseStyle.cursor = 'pointer';
    if (node.arrowCursor) {
        baseStyle.cursor = node.arrowCursor;
    }
    // const points = `0,0 0,${height} ${width},${midHeight}`;
    var points = '0.59 10.6464 5.17 6.24 0.59 1.8336 2 0.48 8 6.24 2 12';

    return (
        <div style={baseStyle} onClick={onClick}>
            <div style={style.wrapper}>
                <svg height={height} width={width} display={svgDisplay}>
                    <polygon points={points}
                             style={style.arrow}/>
                </svg>
            </div>
        </div>
    );
};
Toggle.propTypes = {
    style: PropTypes.object
};

const Header = ({node, style}) => {
    return (
        <div style={style.base}>
            <div style={style.title}>
                {node.name}
            </div>
        </div>
    );
};
Header.propTypes = {
    style: PropTypes.object,
    node: PropTypes.object.isRequired
};

@Radium
class Container extends React.Component {
    render() {
        const {style, decorators, terminal, onClick, node} = this.props;
        return (
            <div onClick={!this.props.svgToggle ? onClick: ''}
                 ref={ref => this.clickableRef = ref}
                 style={style.container}>
                {!terminal ? this.renderToggle() : null}

                <decorators.Header node={node}
                                   style={style.header}
                                   indexChildren={this.props.indexChildren} />
            </div>
        );
    }

    renderToggle() {
        const {animations} = this.props;

        if (!animations) {
            return this.renderToggleDecorator();
        }

        return (
            <VelocityComponent animation={animations.toggle.animation}
                               duration={animations.toggle.duration}
                               ref={ref => this.velocityRef = ref}>
                {this.renderToggleDecorator()}
            </VelocityComponent>
        );
    }

    renderToggleDecorator() {
        const {style, decorators, node, svgToggle, onClick} = this.props;
        const params = {
            style: style.toggle,
            node: node,
            svgToggle: svgToggle,
            onClick: onClick,
        }
        return <decorators.Toggle props={params} />;
    }
}
Container.propTypes = {
    style: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    terminal: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]).isRequired,
    node: PropTypes.object.isRequired
};

export default {
    Loading,
    Toggle,
    Header,
    Container
};
