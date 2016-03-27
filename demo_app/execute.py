from TwitterAPI import TwitterAPI
import os
import re

consumer_key = "1Yn8SkgvIrLiXRk22aU6IhZ20"
consumer_secret = "udsYuEMi2rU77EaTG9vWlIPXOf9YcunHvOHXQPH2AUod7fSGD7"
access_token_secret = "UIoINgPNBSrflcgZFa3ZkyJvKowLyDFm1HQw47D2voSWL"
access_token_key = "2296276094-ywo927aAwEsO9rNYBw8734QGeU0oT3Xe1caRfm2"


def filename_matcher(text, filename):
    if text == filename:
        return True
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

def totem(command, device, output):
    cl = 'totem ' + command['intent']
    if command['intent'] == '--play':

        # Only `totem --play` will unpause the application
        # If the name of a song is mentioned `totem --play songname` will be executed
        if command['arguments']['name']:
            command['arguments']['name'] = command['arguments']['name'].strip(' ')

            # Remove 'totem' if it exists in the filname
            if ('totem') in command['arguments']['name']:
                temp = command['arguments']['name'].split(' ')
                temp.remove('totem')
                command['arguments']['name'] = ' '.join(temp)

            matched_files = [] # Keep track of all the files that match

            # Walk in the required directories to find music
            for dirName, subdirList, fileList in os.walk("./"):
                for filename in fileList:
                    if filename_matcher(command['arguments']['name'], filename):
                        print('Matched: ', filename)
                        matched_files.append(filename)
            if len(matched_files) == 0:
                output['message'] = 'No files were found'
                return output
            elif len(matched_files) > 1:
                output['final'] = False
                output['message'] = 'Which song do you want to play?'
                output['options'] = matched_files
                output['type'] = 'option'
                output['option-type'] = 'arguments' # Refer JSON to know what this refers to
                output['option-name'] = 'name' # Refer JSON to know what this refers to
                return output
            else:
                output = {
                    'commands': [],
                    'error': False,
                    'final': True,
                    'parsed': command,
                    'message': 'Executed command',
                    'type': None,
                }
                cl += ' "' + matched_files[0] + '"'
    cl += ' &'
    print(cl)
    return_value = os.system(cl)
    if return_value == 0:
        return output
    # What should we do if return value isn't 0?
    return output

def tweet(command, device, output): 
    tweets=[]    
    k=1    
    print(command)
    if command['intent'] == 'examples':
        example =[]
        example.append("fetch/get tweets by/of @screen_name")
        example.append("fetch/get tweets on/about @some_name")
        output['final'] = 'twitter_False'
        output['message'] = 'Enter as shown below'
        output['options'] = example
        output['type'] = 'option'
        output['option-type'] = 'arguments' # Refer JSON to know what this refers to
        output['option-name'] = 'name' # Refer JSON to know what this refers to
        return output

    try:
        api = TwitterAPI(consumer_key, consumer_secret, access_token_key, access_token_secret)   
        obj = command['arguments']['name'] 

        if re.match('^[ ]*$', obj):
            obj=''
            print("PPPP")

        if obj is '':
            example =[]
            example.append("fetch/get tweets by/of @screen_name")
            example.append("fetch/get tweets on/about @some_name")
            output['final'] = 'twitter_False' # use this for time being
            output['message'] = 'Enter as shown below'
            output['options'] = example
            output['type'] = 'option'
            output['option-type'] = 'arguments' # Refer JSON to know what this refers to
            output['option-name'] = 'name' # Refer JSON to know what this refers to
            return output   
        
        if command['intent'] == 'statuses/user_timeline':    
            query = 'screen_name'    
        else:    
            query = 'q'    
  
        r = api.request(command['intent'], {query:obj, 'count':5})
        print(r.status_code)  
    
        for item in r:    
            print(item['text'])    
            string = item['text'].replace('\n','<br />        ')    
            tweets.append(string)    
            k+=1   

        output = {
             'commands': [],
             'error': False,
             'final': True,
             'parsed': command,
             'message': 'Executed command',
             'type': None,
             'tweet':tweets
        }
        return output    
    
    except:    
        output = {    
           'message':'invalid input', 
           'error':True,
           'final':True
        }    
        return output    
 
def process(command, device, output):
    if command['device'] == 'totem':
        return totem(command, device, output)
    if command['device'] == 'tweet':
        os.system("chcp 65001")
        return tweet(command, device, output)
    elif command['device'] == 'tetris':
        return tetris(command, device, output)

def tetris(command, device, output):
    return output

