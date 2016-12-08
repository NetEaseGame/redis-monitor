import React from 'react';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Index from '../index.jsx';
import OnFireMixin from '../mixins/onFireMixin.jsx';

const MainComponent = React.createClass({
  __ONFIRE__: 'MainComponent',
  mixins: [OnFireMixin],  // 引入 mixin
  render: function() {
    let children = this.props.children || <Index />;
    return (
      <div>
        <Header />
        { children }
        <Footer />
      </div>
    );
  }
});

export default MainComponent;