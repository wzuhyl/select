import Trigger from 'rc-trigger';
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import DropdownMenu from './DropdownMenu';
import ReactDOM from 'react-dom';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

const SelectTrigger = React.createClass({
  propTypes: {
    dropdownMatchSelectWidth: PropTypes.bool,
    dropdownAlign: PropTypes.object,
    visible: PropTypes.bool,
    multiple: PropTypes.bool,
    inputValue: PropTypes.string,
    filterOption: PropTypes.any,
    options: PropTypes.any,
    prefixCls: PropTypes.string,
    popupClassName: PropTypes.string,
    children: PropTypes.any,
  },

  componentDidUpdate() {
    const { visible, dropdownMatchSelectWidth } = this.props;
    if (visible) {
      const dropdownDOMNode = this.getPopupDOMNode();
      if (dropdownDOMNode) {
        const widthProp = dropdownMatchSelectWidth ? 'width' : 'minWidth';
        dropdownDOMNode.style[widthProp] = `${ReactDOM.findDOMNode(this).offsetWidth}px`;
      }
    }
  },

  getInnerMenu() {
    return this.popupMenu && this.popupMenu.refs.menu;
  },

  getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  },

  getDropdownElement(newProps) {
    const props = this.props;
    return (<DropdownMenu
      ref={this.saveMenu}
      {...newProps}
      prefixCls={this.getDropdownPrefixCls()}
      onMenuSelect={props.onMenuSelect}
      onMenuDeselect={props.onMenuDeselect}
      value={props.value}
      defaultActiveFirstOption={props.defaultActiveFirstOption}
      dropdownMenuStyle={props.dropdownMenuStyle}
    />);
  },

  getDropdownTransitionName() {
    const props = this.props;
    let transitionName = props.transitionName;
    if (!transitionName && props.animation) {
      transitionName = `${this.getDropdownPrefixCls()}-${props.animation}`;
    }
    return transitionName;
  },

  getDropdownPrefixCls() {
    return `${this.props.prefixCls}-dropdown`;
  },

  saveMenu(menu) {
    this.popupMenu = menu;
  },
  render() {
    const props = this.props;
    const { multiple, visible, inputValue, dropdownAlign } = props;
    const dropdownPrefixCls = this.getDropdownPrefixCls();
    const popupClassName = {
      [props.dropdownClassName]: !!props.dropdownClassName,
      [`${dropdownPrefixCls}--${multiple ? 'multiple' : 'single'}`]: 1,
    };
    const search = multiple || props.combobox || !props.showSearch ? null : (
      <span className={`${dropdownPrefixCls}-search`}>{props.inputElement}</span>
    );
    const popupElement = this.getDropdownElement({
      menuItems: props.options,
      search,
      multiple,
      inputValue,
      visible,
    });
    return (<Trigger {...props}
      action={props.disabled ? [] : ['click']}
      hideAction={props.disabled ? [] : ['blur']}
      ref="trigger"
      popupPlacement="bottomLeft"
      builtinPlacements={BUILT_IN_PLACEMENTS}
      prefixCls={dropdownPrefixCls}
      popupTransitionName={this.getDropdownTransitionName()}
      onPopupVisibleChange={props.onDropdownVisibleChange}
      popup={popupElement}
      popupAlign={dropdownAlign}
      popupVisible={visible}
      popupClassName={classnames(popupClassName)}
      popupStyle={props.dropdownStyle}
    >{props.children}</Trigger>);
  },
});

export default SelectTrigger;
