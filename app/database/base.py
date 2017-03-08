# -*- coding: utf-8 -*-
'''
Created on 2016-12-07

@author: hustcc
'''
from __future__ import absolute_import
from app import SQLAlchemyDB as db


class BaseMethod(object):
    __table_args__ = {'mysql_engine': 'MyISAM', 'mysql_charset': 'utf8'}

    # insert and update
    def save(self):
        db.session.add(self)
        db.session.commit()

    # delete
    def delete(self):
        db.session.delete(self)
        db.session.commit()
