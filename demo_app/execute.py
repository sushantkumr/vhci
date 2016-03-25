import os
import re

def filename_matcher(text,filename):
    flag = True 
    li = text.split()
    if filename.endswith(('.mp3','.MP3','.flac','.m3u','.m4a','.wav','.flv')):
        filename = filename[:-4]
    fn_list = re.split(' |-|_',filename)
    fn_list = [x.lower() for x in fn_list]
    for word in li:
        if word.lower() in fn_list:
            fn_list.pop(fn_list.index(word.lower()))
        else:
            flag = False
            break
    if not flag:
        return False
    else:
        return True

def totem(command):
    cl = 'totem ' + command['intent']
    if command['intent'] == '--play':
        if command['arguments']['name']:
            command['arguments']['name'] = command['arguments']['name'].strip(' ')
            # mutiple filenames and stuff aren't supported yet
            # give the proper filename if you want to play something
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