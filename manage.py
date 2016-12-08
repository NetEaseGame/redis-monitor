# -*- coding: utf-8 -*-
'''
Created on 2016-12-08

@author: hustcc
'''

from flask_script import Manager, Command, Server as _Server, Option
from app import SQLAlchemyDB as db, app, __version__
import os


manager = Manager(app)


class Server(_Server):
    help = description = 'Runs the Redis-monitor web server'

    def get_options(self):
        options = (
            Option('-h', '--host',
                   dest='host',
                   default='0.0.0.0'),
            Option('-p', '--port',
                   dest='port',
                   type=int,
                   default=9527),
            Option('-d', '--debug',
                   action='store_true',
                   dest='use_debugger',
                   help=('enable the Werkzeug debugger (DO NOT use in '
                         'production code)'),
                   default=self.use_debugger),
            Option('-D', '--no-debug',
                   action='store_false',
                   dest='use_debugger',
                   help='disable the Werkzeug debugger',
                   default=self.use_debugger)
        )
        return options

    def __call__(self, app, host, port, use_debugger):
        if use_debugger is None:
            use_debugger = app.debug
            if use_debugger is None:
                # default is False
                use_debugger = False

        app.run(host, port, debug=use_debugger, threaded=True)


manager.add_command("start", Server())


CONFIG_TEMP = """# -*- coding: utf-8 -*-
'''
Created on 2016-12-07

@author: hustcc
'''

# for sqlite
SQLALCHEMY_DATABASE_URI = 'sqlite:///%s'
# for mysql
# SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://dev:dev@127.0.0.1/redis_monitor'
"""


class Init(Command):
    """Generates new configuration file into user Home dir."""
    name = 'config'
    capture_all_args = True

    def run(self, argv):
        dir = os.path.join(os.path.expanduser('~'), '.redis-monitor')
        if not os.path.exists(dir):
            os.makedirs(dir)
        if os.path.isdir(dir):
            path = os.path.join(dir, 'redis_monitor_config.py')
            if os.path.exists(path):
                print('Fail: the configuration file exist in `%s`.' % path)
            else:
                sqlite_file = os.path.join(dir, 'redis_monitor.db') \
                                .replace('\\', '/')
                with open(path, 'w') as f:
                    f.write(CONFIG_TEMP % sqlite_file)
                print('OK: init configuration file into `%s`.' % path)

                db.create_all()
                print('OK: database is initialed into `%s`.' % sqlite_file)
        else:
            print('Fail: %s should be directory.' % dir)


manager.add_command("init", Init())


@manager.command
def createdb(drop_first=False):
    """Creates the database."""
    if drop_first:
        db.drop_all()
    db.create_all()
    print('OK: database is initialed.')


@manager.command
def version():
    "Shows the version"
    print __version__


# script entry
def run():
    manager.run()


if __name__ == '__main__':
    manager.run()
