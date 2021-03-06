import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export class TopBar extends React.Component {
  componentDidMount() {
    const topBarControls = document.getElementsByClassName('hs_topBarControlsBtn');
    Array.prototype.forEach.call(topBarControls, (topBarControl) => {
      topBarControl.addEventListener('click', (event) => {
        const topBarDropdowns = document.getElementsByClassName('hs_topBarDropdown');
        for (let i = 0; i < topBarDropdowns.length; i++) {
          if (event.currentTarget.getAttribute('data-dropdown') === topBarDropdowns[i].getAttribute('data-dropdown')) {
            if (topBarDropdowns[i].style.display === 'none') {
              topBarDropdowns[i].style.display = 'block';
              event.currentTarget.classList.add('active');
            } else {
              topBarDropdowns[i].style.display = 'none';
              event.currentTarget.classList.remove('active');
            }
          } else {
            // remove active on all dropdown buttons except the one that was clicked
            const topBarBtns = document.getElementsByClassName('hs_topBarControlsBtn');
            for (let p = 0; p < topBarBtns.length; p++) {
              if (topBarBtns[p].getAttribute('data-dropdown') !== event.currentTarget.getAttribute('data-dropdown')) {
                topBarBtns[p].classList.remove('active');
              }
            }
            // close all dropdowns except the one that was clicked
            topBarDropdowns[i].style.display = 'none';
          }
        }
      });
    });
  }

  render() {
    const headers = [];
    const elements = React.Children.map(this.props.children, (x, idx) => {
      if (!x || (x.type !== 'menu' && x.type !== 'header')) {
        return x;
      }
      const children = React.Children.toArray(x.props.children);
      if (x.type === 'header') {
        headers.push(children);
        return null;
      }
      const firstChild = children.shift();
      headers.push(<li key={idx} className={`hs_topBarControlsBtn hs_${x.props.name}Btn`} data-dropdown={x.props.name} title={x.props.title}>{firstChild}</li>);
      return <ul key={idx} className={`hs_topBarDropdown hs_${x.props.name}Dropdown hs_dropdownMenuList`} data-dropdown={x.props.name} style={{ display: 'none' }}>{children}</ul>;
    });
    return (
      <div className="hs_topBar">
        <div className="hs_topBarContent">
          <ul className="hs_topBarControls">
            {headers}
          </ul>
          <h1 className="hs_topBarTitle">{this.props.title}</h1>
        </div>
        {elements}
      </div>
    );
  }
}

TopBar.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export class Messages extends React.Component {
  render() {
    const messages = React.Children.map(this.props.children, (x, idx) => {
      if (x.type !== 'msg') {
        return x;
      }
      const { className, ...pprops } = x.props;
      const classNames = classnames(className, 'hs_message');
      return (
        <div key={idx} className={classNames} {...pprops}>
          {x.props.children}
        </div>);
    });
    return (
      <div className={`hs_${this.props.type || 'messages'}`}>
        {messages}
      </div>
    );
  }
}

Messages.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
};
