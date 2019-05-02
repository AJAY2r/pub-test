'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import {VelocityTransitionGroup} from 'velocity-react';
import LazyLoad from 'react-lazy-load';

import NodeHeader from './header';

class TreeNode extends React.Component {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const {node, onToggle} = this.props;
        const {toggled} = node;

        if (onToggle) {
            onToggle(node, !toggled, e);
        }
    }

    handleCheckbox(e) {
        const isChecked = !e;
        const chkName = this.props.node[this.props.checkboxField];
        var handleCheckbox = this.props.handleCheckbox;
        if (handleCheckbox) {
            handleCheckbox(this.props.node, chkName , isChecked);
        }
    }

    animations() {
        const {animations, node} = this.props;

        if (animations === false) {
            return false;
        }

        const anim = Object.assign({}, animations, node.animations);
        return {
            toggle: anim.toggle(this.props),
            drawer: anim.drawer(this.props)
        };
    }

    decorators() {
        // Merge Any Node Based Decorators Into The Pack
        const {decorators, node} = this.props;
        let nodeDecorators = node.decorators || {};

        return Object.assign({}, decorators, nodeDecorators);
    }

    renderCheckbox() {
        const chkChecked = _.includes(this.props.checkedOptions, this.props.node[this.props.checkboxField]) || false;
        let checkboxElement;
        if (this.props.enableCheckbox && !this.props.node.skipCheckbox && this.props.node.name) {
            let className = 'fa fa-square-o decomposition-item-checkbox';
            if (chkChecked) {
                className = 'fa fa-check decomposition-item-checkbox';
            }
            if (this.props.node.disableCheckbox) {
                className = 'fa fa-square-o-disable decomposition-item-checkbox';
                if (chkChecked) {
                    className = 'fa fa-square-check-disable decomposition-item-checkbox';
                }
                checkboxElement =  (
                    <span className={className} value={this.props.node[this.props.checkboxField]} />
                );
            } else {
                checkboxElement =  (
                    <span className={className} value={this.props.node[this.props.checkboxField]} onClick={this.handleCheckbox.bind(this, chkChecked)} />
                );
            }
        }
        return checkboxElement;
    }

    render() {
        const {style} = this.props;
        const decorators = this.decorators();
        const animations = this.animations();
        const nodeChecked = _.includes(this.props.nodeCheckedOptions, this.props.node[this.props.nodeSelectionField]) || false;
        const liClassTmp = nodeChecked && this.props.fillSelectedNode ? 'selected' : '';
        const lazyLoadNodeHeight = this.props.lazyLoadNodeHeight;
        let tmpHeight = 'auto';
        if (lazyLoadNodeHeight && (!this.props.node.children || this.props.node.children.length === 0)) {
            tmpHeight = lazyLoadNodeHeight;
        }
        const styleBase = _.cloneDeep(style.base);
        if (this.props.node.nodeHide) {
            styleBase.display = 'none';
        }
        let data;
        if (this.props.enableLazyLoading) {
            data = (
                <LazyLoad height={tmpHeight} debounce={this.props.debounce} throttle={this.props.throttle}>
                <li ref={ref => this.topLevelRef = ref}
                    className={liClassTmp}
                    style={styleBase}>
                    {this.renderHeader(decorators, animations)}
                    {this.renderCheckbox()}
                    {this.renderDrawer(decorators, animations)}
                </li>
                </LazyLoad>
            );
        } else {
            data = (
                <li ref={ref => this.topLevelRef = ref}
                    className={liClassTmp}
                    style={styleBase}>
                    {this.renderHeader(decorators, animations)}
                    {this.renderCheckbox()}
                    {this.renderDrawer(decorators, animations)}
                </li>
            );
        }
        return data;
    }

    renderDrawer(decorators, animations) {
        const {node: {toggled}} = this.props;

        if (!animations && !toggled) {
            return null;
        } else if (!animations && toggled) {
            return this.renderChildren(decorators, animations);
        }

        const {animation, duration, ...restAnimationInfo} = animations.drawer;
        return (
            <VelocityTransitionGroup {...restAnimationInfo}
                                     ref={ref => this.velocityRef = ref}>
                {toggled ? this.renderChildren(decorators, animations) : null}
            </VelocityTransitionGroup>
        );
    }

    renderHeader(decorators, animations) {
        const {node, style, svgToggle, fillSelectedNode} = this.props;

        return (
            <NodeHeader animations={animations}
                        decorators={decorators}
                        node={Object.assign({}, node)}
                        onClick={this.onClick}
                        style={style}
                        svgToggle={svgToggle}
                        checkedOptions={this.props.checkedOptions}
                        checkboxField={this.props.checkboxField}
                        nodeCheckedOptions={this.props.nodeCheckedOptions}
                        nodeSelectionField={this.props.nodeSelectionField}
                        enableLazyLoading={this.props.enableLazyLoading}
                        lazyLoadNodeHeight={this.props.lazyLoadNodeHeight}
                        debounce={this.props.debounce}
                        throttle={this.props.throttle}
                        indexChildren={this.props.indexChildren} />
        );
    }

    renderChildren(decorators) {
        const {animations, decorators: propDecorators, node, style} = this.props;

        if (node.loading) {
            return this.renderLoading(decorators);
        }

        let children = node.children;
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }

        return (
            <ul style={style.subtree}
                ref={ref => this.subtreeRef = ref}>
                {children.map((child, index) => <TreeNode {...this._eventBubbles()}
                                                          animations={animations}
                                                          decorators={propDecorators}
                                                          key={child.id || index}
                                                          node={child}
                                                          style={style}
                                                          enableCheckbox={this.props.enableCheckbox}
                                                          checkboxField={this.props.checkboxField}
                                                          handleCheckbox={this.props.handleCheckbox}
                                                          checkedOptions={this.props.checkedOptions}
                                                          svgToggle={this.props.svgToggle}
                                                          fillSelectedNode={this.props.fillSelectedNode}
                                                          nodeCheckedOptions={this.props.nodeCheckedOptions}
                                                          nodeSelectionField={this.props.nodeSelectionField}
                                                          enableLazyLoading={this.props.enableLazyLoading}
                                                          lazyLoadNodeHeight={this.props.lazyLoadNodeHeight}
                                                          debounce={this.props.debounce}
                                                          throttle={this.props.throttle}
                                                          indexChildren={index} />
                )}
            </ul>
        );
    }

    renderLoading(decorators) {
        const {style} = this.props;

        return (
            <ul style={style.subtree}>
                <li>
                    <decorators.Loading style={style.loading}/>
                </li>
            </ul>
        );
    }

    _eventBubbles() {
        const {onToggle} = this.props;

        return {
            onToggle
        };
    }
}

TreeNode.propTypes = {
    style: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]).isRequired,
    onToggle: PropTypes.func
};

export default TreeNode;
