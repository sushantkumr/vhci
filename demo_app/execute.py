import os
import re

def filename_matcher(text, filename):
    li = text.split()
    if filename.endswith(('.mp3','.MP3','.mp4','.m3u','.m4a','.wav','.flv')):
        filename = filename[:-4]
    fn_list = re.split(' |-|_|\.', filename.lower())
    for word in li:
        if word.lower() in fn_list:
            fn_list.pop(fn_list.index(word.lower()))
        else:
            return False
    return True

def totem(command):
    cl = 'totem ' + command['intent']
    if command['intent'] == '--play':
        if command['arguments']['name']:
            command['arguments']['name'] = command['arguments']['name'].strip(' ')
            if ('totem') in command['arguments']['name']:
                temp = command['arguments']['name'].split(' ')
                temp.remove('totem')
                command['arguments']['name'] = ' '.join(temp)
            for dirName, subdirList, fileList in os.walk("./"):
                for filename in fileList:
                    # if (re.search(command['arguments']['name'], filename, re.IGNORECASE)):
                    if filename_matcher(command['arguments']['name'],filename):
                        # list_of_files.append(filename)                    
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