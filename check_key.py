import importlib
m = importlib.import_module('app')
print('API_KEY set?', bool(getattr(m, 'API_KEY', None)))
print('client is None?', getattr(m, 'client', None) is None)
