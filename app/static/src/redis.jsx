import React from 'react';
import { Link } from 'react-router';
import AdSense from 'react-adsense';
import OnFireMixin from './mixins/onFireMixin.jsx';
import TipShowMixin from './mixins/tipShowMixin.jsx';
import RequestsMixin from './mixins/xhrRequestsMixin.jsx';
import Utils from './utils/utils.jsx';
import ReactEcharts from 'echarts-for-react';

const Redis = React.createClass({
  __ONFIRE__: 'Redis',
  timer: null,
  max_length: 200,
  intervalTime: 1100,
  mixins: [RequestsMixin, OnFireMixin, TipShowMixin],  // 引入 mixin
  defaultOption: function(text, subtext, legend, yAxis_name, y_format) {
    let option = {
      title: {
        text: text,
        subtext: subtext
      },
      legend: {
        data:legend
      },
      grid: {
        top: 60,
        bottom: 40,
        left: 80,
        right: 20
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show : true,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {show: true, type: ['line', 'bar']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      xAxis: {
        type : 'category',
        data : (function () {
          var now = new Date();
          var res = [];
          var len = this.max_length;
          while (len--) {
            res.unshift(Utils.current_time(now));
            now = new Date(now - this.intervalTime);
          }
          return res;
        }.bind(this))()
      },
      yAxis: {
       type : 'value',
        scale: true,
        name : yAxis_name,
        axisLabel : {
          formatter: '{value} ' + y_format
        }
      },
      series: []
    };
    for (let i = 0; i < legend.length; i ++) {
      option.series.push({
        name: legend[i],
        type: 'line',
        smooth: true,
        data: (function () {
          var res = [];
          var len = this.max_length;
          while (len--) {
            res.unshift(0);
          }
          return res;
        }.bind(this))()
      });
    };
    return option;
  },
  getInitialState: function() {
    return {
      redis: {}, 
      redis_monitor: {},
      time_chart: this.defaultOption('Redis Connect Time', '', ['time'], 'Time', 'ms'),
      ops_chart: this.defaultOption('Redis Command Per Second', '', ['OPS'], 'Cmd count', ''),
      mem_chart: this.defaultOption('Redis Mem Usage', '', ['used_memory', 'used_memory_rss'], 'Mem Usage', ' Kb'),
      cpu_chart: this.defaultOption('Redis Cpu Usage', '', ['cpu_user', 'cpu_sys', 'cpu_user_children', 'cpu_sys_children'], 'Cpu Usage', '')
    };
  },
  refreshRedisInfo: function() {
    this.get('/api/redis_monitor', {md5: this.props.params.md5}, function(r) {
      r = r.json();
      if (r.success) {
        let now = Utils.current_time();
        let time_chart = this.state.time_chart;
        time_chart.series[0].data.shift(); // 删除第一个
        time_chart.series[0].data.push(r.data.get_time);
        time_chart.xAxis.data.shift(); // 删除第一个
        time_chart.xAxis.data.push(now); // 添加一个


        let ops_chart = this.state.ops_chart;
        ops_chart.series[0].data.shift(); // 删除第一个
        ops_chart.series[0].data.push(r.data.instantaneous_ops_per_sec);
        ops_chart.xAxis.data.shift(); // 删除第一个
        ops_chart.xAxis.data.push(now); // 添加一个


        let mem_chart = this.state.mem_chart;
        mem_chart.series[0].data.shift(); // 删除第一个
        mem_chart.series[0].data.push((r.data.used_memory / 1024).toFixed(2));
        mem_chart.series[1].data.shift(); // 删除第一个
        mem_chart.series[1].data.push((r.data.used_memory_rss / 1024).toFixed(2));
        mem_chart.xAxis.data.shift(); // 删除第一个
        mem_chart.xAxis.data.push(now); // 添加一个


        let cpu_chart = this.state.cpu_chart;
        cpu_chart.series[0].data.shift(); // 删除第一个
        cpu_chart.series[0].data.push(r.data.used_cpu_sys);
        cpu_chart.series[1].data.shift(); // 删除第一个
        cpu_chart.series[1].data.push(r.data.used_cpu_user);
        cpu_chart.series[2].data.shift(); // 删除第一个
        cpu_chart.series[2].data.push(r.data.used_cpu_user_children);
        cpu_chart.series[3].data.shift(); // 删除第一个
        cpu_chart.series[3].data.push(r.data.used_cpu_sys_children);
        cpu_chart.xAxis.data.shift(); // 删除第一个
        cpu_chart.xAxis.data.push(now); // 添加一个
 

        this.setState({redis_monitor: r.data});
        // 重新开发
        this.timer = setTimeout(this.refreshRedisInfo, this.intervalTime);
      }
    }.bind(this));
  },
  clear: function() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  },
  flush_redis: function(md5, db) {
    this.get('/api/redis/flushall', {md5: md5, db: db});
  },
  componentDidMount: function() {
    this.clear();
    this.timer = setTimeout(this.refreshRedisInfo, this.intervalTime);

    this.get('/api/redis_info', {md5: this.props.params.md5}, function(r) {
      r = r.json();
      if (r.success) {
        this.setState({redis: r.data});
        this.fire('menus', r.data.host + ':' + r.data.port + ' Monitor', '');
      }
      else this.showError(r.data);
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.clear();
  },
  get_role_header_text: function(is_master, role_master_data) {
    if (is_master) {
      return 'Redis role [ master ], has ' + role_master_data.length + ' slaves';
    }
    else if (is_master === false) {
      return 'Redis role [ slave ], master is ' + this.state.redis_monitor.master_host + ':' + this.state.redis_monitor.master_port;
    }
    else {
      return 'Redis master / slave';
    }
  },
  get_role_master_dom: function(is_master, role_master_data) {
    if (is_master) {
      if (role_master_data.length)
        role_master_data.map(function(e, i) {
          return (
            <tr key={i}>
              <th colSpan="1">{e.key}</th>
              <th colSpan="5">{e.host + ':' + e.port}</th>
              <th colSpan="2">{e.status}</th>
            </tr>
          );
        });
      else
        return (<tr className="role_master_data"><td colSpan="8" style={{textAlign:'center'}}>There has no redis slave.</td></tr>);
    }
  },
  render: function() {
    let role_header_text = 'Redis master / slave';
    // redis role information
    let role_master_data = [], 
      is_master = null,
      db_info = [];

    if (this.state.redis_monitor.role == 'master') is_master = true;
    else if (this.state.redis_monitor.role == 'slave') is_master = false;
        
    for (var key in this.state.redis_monitor) {
      if (key.substring(0, 5) == 'slave') {
        cnt ++;
        data[key] =  data[key].split(',');
        role_master_data.push({
          key: key, 
          host: this.state.redis_monitor[key][0], 
          port: this.state.redis_monitor[key][1], 
          status: this.state.redis_monitor[key][2]
        });
      }

      if (key.substring(0, 2) == 'db') {
        db_info.push({
          key: key,
          keys: this.state.redis_monitor[key].keys,
          expires: this.state.redis_monitor[key].expires,
          avg_ttl: this.state.redis_monitor[key].avg_ttl
        });
      }
    }

    return (
      <div>
        <h1>[<span className="redis_host_port">{this.state.redis.host}:{this.state.redis.port}</span>] Redis Monitor Informations </h1>
        <AdSense.Google client='ca-pub-7292810486004926' slot='7806394673' />

        <table width="100%" border="0" cellPadding="10" cellSpacing="1" style={{margin:'1em 0'}}>
          <tbody>
            <tr className="th_group">
              <th colSpan="8">Server Information</th>
            </tr>
            <tr>
              <th>Vesion</th>
              <th colSpan="2">OS</th>
              <th>Process_ID</th>
              <th colSpan="2">Up_Time</th>
              <th>Connection</th>
              <th>Blocked</th>
            </tr>
            <tr>
                <td>{this.state.redis_monitor.redis_version}</td>
                <td colSpan="2">{this.state.redis_monitor.os}</td>
                <td>{this.state.redis_monitor.process_id}</td>
                <td colSpan="2">{Utils.sec_2_hour(this.state.redis_monitor.uptime_in_seconds)} / {this.state.redis_monitor.uptime_in_days} Days</td>
                <td>{this.state.redis_monitor.connected_clients}</td>
                <td>{this.state.redis_monitor.blocked_clients}</td>
            </tr>
            <tr className="th_group">
              <th colSpan="8">Stats Information</th>
            </tr>
            <tr>
              <th>connect_received</th>
              <th>cmd_processed</th>
              <th>ops_per_sec</th>
              <th>rejected_connect</th>
              <th>expired_keys</th>
              <th>evicted_keys</th>
              <th>hits</th>
              <th>misses</th>
            </tr>
            <tr>
              <td>{this.state.redis_monitor.total_connections_received}</td>
              <td>{this.state.redis_monitor.total_commands_processed}</td>
              <td>{this.state.redis_monitor.instantaneous_ops_per_sec}</td>
              <td>{this.state.redis_monitor.rejected_connections}</td>
              <td>{this.state.redis_monitor.expired_keys}</td>
              <td>{this.state.redis_monitor.evicted_keys}</td>
              <td>{this.state.redis_monitor.keyspace_hits}</td>
              <td>{this.state.redis_monitor.keyspace_misses}</td>
            </tr>
            <tr className="th_group">
              <th colSpan="8" ref="role_header">{this.get_role_header_text(is_master, role_master_data)}</th>
            </tr>
            {
              is_master && 
                (<tr ref="redis_master_header">
                  <th colSpan="1">slave</th>
                  <th colSpan="5">slave host:port</th>
                  <th colSpan="2">status</th>
                </tr>)
            }
            {
              this.get_role_master_dom(is_master, role_master_data)
            }
            {
              is_master === false && 
              (
                <tr className="role_slave">
                  <th>priority</th>
                  <td>{this.state.redis_monitor.slave_priority}</td>
                  <th>read_only</th>
                  <td>{this.state.redis_monitor.slave_read_only}</td>
                  <th>master_sync</th>
                  <td>{this.state.redis_monitor.master_sync_in_progress}</td>
                  <th>connected_slaves</th>
                  <td>{this.state.redis_monitor.connected_slaves}</td>
                </tr>
              )
            }
            
            <tr className="th_group">
              <th colSpan="8">Redis DB</th>
            </tr>
            <tr>
              <th colSpan="2">DB</th>
              <th colSpan="2">keys</th>
              <th colSpan="1">expires</th>
              <th colSpan="1">avg_ttl</th>
              <th colSpan="2">Operate</th>
            </tr>
            {
              db_info.map(function(e, i) {
                return (
                  <tr key={i} className="rb_td">
                    <td colSpan="2">{e.key}</td>
                    <td colSpan="2">{e.keys}</td>
                    <td colSpan="1">{e.expires}</td>
                    <td colSpan="1">{e.avg_ttl}</td>
                    <td colSpan="2">
                      <input type="button" 
                             onClick={this.flush_redis.bind(this, this.props.params.md5, e.key.substring(2))} 
                             value="Flush DB" />
                    </td>
                  </tr>
                );
              }.bind(this))
            }
            
          </tbody>
        </table>
        <ReactEcharts 
          option={this.state.time_chart} 
          style={{height: '300px'}} />
        <ReactEcharts 
          option={this.state.ops_chart} 
          style={{height: '300px'}} />
        <ReactEcharts 
          option={this.state.mem_chart} 
          style={{height: '300px'}} />
        <ReactEcharts 
          option={this.state.cpu_chart} 
          style={{height: '300px'}} />
      </div>
    );
  }
});

export default Redis;