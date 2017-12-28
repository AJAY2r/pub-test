'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import TreeNode from './node';
import defaultDecorators from './decorators';
import defaultTheme from '../themes/default';
import defaultAnimations from '../themes/animations';

class TreeBeard extends React.Component {
    render() {
        const {animations, decorators, data: propsData, onToggle, style} = this.props;
        let data = propsData;

        // Support Multiple Root Nodes. Its not formally a tree, but its a use-case.
        if (!Array.isArray(data)) {
            data = [data];
        }
        return (
            <ul style={style.tree.base}
                ref={ref => this.treeBaseRef = ref}>
                {data.map((node, index) =>
                    <TreeNode animations={animations}
                              decorators={decorators}
                              key={node.id || index}
                              node={node}
                              onToggle={onToggle}
                              style={style.tree.node}
                              enableCheckbox={this.props.enableCheckbox}
                              checkboxField={this.props.checkboxField}
                              handleCheckbox={this.props.handleCheckbox}
                              checkedOptions={this.props.checkedOptions} />
                )}
            </ul>
        );
    }
}

TreeBeard.propTypes = {
    style: PropTypes.object,
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]).isRequired,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]),
    onToggle: PropTypes.func,
    decorators: PropTypes.object,
    enableCheckbox: PropTypes.bool,
    checkboxField: PropTypes.string,
    checkedOptions: PropTypes.array,
    handleCheckbox: PropTypes.func
};

TreeBeard.defaultProps = {
    style: defaultTheme,
    animations: defaultAnimations,
    decorators: defaultDecorators,
    enableCheckbox: false,
    checkboxField: 'name',
    checkedOptions: []
};

export default TreeBeard;
