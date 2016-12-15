# -*- coding: utf-8 -*-
'''
Created on 2016-12-15

@author: hustcc
'''

import time
import hashlib
try:
    import cPickle as pickle
except:
    import pickle
from functools import wraps


class MemoryAdapter(object):
    '''
    use for memory cache
    '''
    db = {}

    def __init__(self, timeout=-1):
        if MemoryAdapter.db is None:
            MemoryAdapter.db = {}
        self.timeout = timeout

    def get(self, key):
        cache = MemoryAdapter.db.get(key, {})
        if time.time() - cache.get('time', 0) > 0:
            self.remove(key)  # timeout, rm key, reduce memory
            raise Exception(key)
        else:
            return cache.get('value', None)

    def set(self, key, value):
        cache = {
            'value': value,
            'time': time.time() + self.timeout
        }
        MemoryAdapter.db[key] = cache
        return True

    def remove(self, key):
        return MemoryAdapter.db.pop(key, {}).get('value', None)

    def flush(self):
        MemoryAdapter.db.clear()
        return True


def wrapcache(timeout=-1, adapter=MemoryAdapter):
    '''
    the Decorator to cache Function.
    '''
    def _wrapcache(function):
        @wraps(function)
        def __wrapcache(*args, **kws):
            inputs = (function.__name__, args, kws)
            hash_key = hashlib.md5(pickle.dumps(inputs)).hexdigest()
            adapter_instance = adapter(timeout=timeout)
            try:
                return pickle.loads(adapter_instance.get(hash_key))
            except:
                # timeout
                value = function(*args, **kws)
                adapter_instance.set(hash_key, pickle.dumps(value))
                return value
        return __wrapcache
    return _wrapcache
