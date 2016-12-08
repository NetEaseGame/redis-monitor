import React from 'react';
import { Link } from 'react-router';
import OnFireMixin from '../mixins/onFireMixin.jsx';

const Header = React.createClass({
  __ONFIRE__: 'Header',
  mixins: [OnFireMixin],  // 引入 mixin
  getInitialState: function() {
    return {title: 'Redis List', url: ''};
  },
  componentWillMount: function() {
    this.on('menus', function(title, url) {
      this.setState({title: title, url: url});
    }.bind(this));
  },
  render: function() {
    return (
      <p className="breadcrumb">
        <Link to="/"> Home </Link> &gt; <Link to={this.state.url}> {this.state.title} </Link>
      </p>
    )
  }
});

export default Header;