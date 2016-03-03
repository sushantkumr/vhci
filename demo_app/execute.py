import os

def totem(command):
    cl = 'totem ' + command['intent']
    if command['intent'] == '--play':
        if command['arguments']['name']:
            # mutiple filenames and stuff aren't supported yet
            # give the proper filename if you want to play something
            cl += ' ' + command['arguments']['name']
    return_value = os.system(cl)
    if return_value == 0:
        return {
            'message': 'Executed command successfully'
        }

def process(command):
    if command['device'] == 'totem':
        return totem(command)
