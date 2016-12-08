import React from 'react';
import { Link } from 'react-router';

const Footer = React.createClass({
  render: function() {
    return (
      <p className="footer">
        <Link to="/">Redis Monitor</Link> &gt; Author By <a target="_blank" href="https://github.com/hustcc">hustcc</a>
      </p>
    )
  }
});

export default Footer;