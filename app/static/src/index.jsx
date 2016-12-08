import React from 'react';
import { Link } from 'react-router';
import AdSense from 'react-adsense';
import OnFireMixin from './mixins/onFireMixin.jsx';
import TipShowMixin from './mixins/tipShowMixin.jsx';
import RequestsMixin from './mixins/xhrRequestsMixin.jsx';
import TimeAgo from 'timeago-react';

const Index = React.createClass({
   __ONFIRE__: 'Index',
  mixins: [RequestsMixin, OnFireMixin, TipShowMixin],  // 引入 mixin
  getInitialState: function() {
    return {redis_list: []};
  },
  onBtnSubmit: function() {
    let host = this.refs.new_host;
    let port = this.refs.new_port;
    let password = this.refs.new_password;

    this.post('/api/add', {
      host: host.value,
      port: port.value || '6379',
      password: password.value
    }, function(r) {
      r = r.json();
      if (r.success) {
        // 成功，放到最前面
        this.loadRedisList();
      }
      else this.showError(r.data);
    }.bind(this));
  },
  onBtnExample: function() {
    this.refs.new_host.value = '127.0.0.1';
    this.refs.new_password.value = '';
    // submit
    this.onBtnSubmit();
  },
  onDelRedis: function(md5) {
    this.post('/api/del', {md5: md5}, function(r) {
      r = r.json();
      if (r.success) {
        this.loadRedisList();
      }
      else this.showError(r.data);
    }.bind(this));
  },
  loadRedisList: function() {
    this.get('/api/redis_list', {}, function(r) {
      r = r.json();
      if (r.success) this.setState({redis_list: r.data});
      else this.showError(r.data);
    }.bind(this));
  },
  componentDidMount: function() {
    this.loadRedisList()
  },
  render: function() {
    return (
      <div>
        <h1>Redis Instance List - Redis Monitor Informations </h1>
        <AdSense.Google client='ca-pub-7292810486004926' slot='7806394673' />

        <form ref='form'>
          Host: <input type="text" placeholder="Redis host / ip" ref="new_host" />&nbsp;&nbsp;
          Port: <input type="number" placeholder="6379" ref="new_port" />&nbsp;&nbsp;
          Password: <input type="text" placeholder="password" ref="new_password" />&nbsp;&nbsp;
          <input type="button" onClick={this.onBtnSubmit} defaultValue="Add / Update" />&nbsp;
          <input type="button" onClick={this.onBtnExample} defaultValue="Example" />
        </form>

        <table width="100%" border="0" cellPadding="10" cellSpacing="1" style={{margin:'1em 0'}}>
          <tbody>
            <tr>
                <th width="40%" bgcolor="#DDEEFF">Redis Information</th>
                <th width="40%" bgColor="#DDEEFF">Add Datetime</th>
                <th width="20%" bgColor="#DDEEFF">Operation</th>
            </tr>
            {
              this.state.redis_list.map(function(redis, i) {
                return (
                  <tr key={i}>
                    <td><Link to={redis.md5}>{redis.host}:{redis.port}</Link></td>
                    <td>
                      {redis.add_time} [<TimeAgo datetime={redis.add_time || new Date()} />]
                    </td>
                    <td><input type="button" onClick={this.onDelRedis.bind(this, redis.md5)} defaultValue="Delete" /></td>
                  </tr>
                )
              }.bind(this))
            }
          </tbody>
        </table>
      </div>
    );
  }
});

export default Index;