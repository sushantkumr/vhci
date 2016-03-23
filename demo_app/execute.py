import os
import re
#!/usr/bin/env python3
def totem(command):
    cl = 'totem ' + command['intent']
    if command['intent'] == '--play':
        if command['arguments']['name']:
            command['arguments']['name'] = command['arguments']['name'].strip(' ')
            # mutiple filenames and stuff aren't supported yet
            # give the proper filename if you want to play something
            for dirName, subdirList, fileList in os.walk("./"):
                for filename in fileList:
                    if (re.search(command['arguments']['name'], filename, re.IGNORECASE)):
                        print(filename)
                        cl += ' ' + '"' + filename + '"'                        
                        break
                        # li.append(filename)
            # cl += ' ' + command['arguments']['name']
    cl += ' &'
    print(cl)
    return_value = os.system(cl)
    if return_value == 0:
        return {
            'message': 'Executed command successfully'
        }

def process(command):
    if command['device'] == 'totem':
        return totem(command)
