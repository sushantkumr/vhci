import os
from TwitterAPI import TwitterAPI

consumer_key = "1Yn8SkgvIrLiXRk22aU6IhZ20"
consumer_secret = "udsYuEMi2rU77EaTG9vWlIPXOf9YcunHvOHXQPH2AUod7fSGD7"
access_token_secret = "UIoINgPNBSrflcgZFa3ZkyJvKowLyDFm1HQw47D2voSWL"
access_token_key = "2296276094-ywo927aAwEsO9rNYBw8734QGeU0oT3Xe1caRfm2"

def totem(command):
    names = 'start wmplayer playlist/prashanth'
    cl = 'totem ' + command['intent']
    if command['intent'] == '--play':
        if command['arguments']['name']:
            # mutiple filenames and stuff aren't supported yet
            # give the proper filename if you want to play something
            cl += ' ' + command['arguments']['name']
    cl += ' &'
    return_value = os.system(names)
    if return_value == 0:
        return {
            'message': 'Executed command successfully'
        }


def tweet(command):   
    res={}    
    k=1    
    api = TwitterAPI(consumer_key, consumer_secret, access_token_key, access_token_secret)    
    obj = command['arguments']['name']    
    trig = command['intent']    
    if trig == 'statuses/user_timeline':
        print("ikjhs")    
        query = 'screen_name'    
    else:    
        query = 'q'    
  
    try:    
        print("ll")
        r = api.request(trig, {query:obj, 'count':5})    
    
        for item in r:    
            print(item['text'])    
            string = item['text'].replace('\n','<br />        ')    
            res[k]=string    
            k+=1    
        return res    
    
    except:    
        res={    
           'error':'invalid input'    
        }    
        return res    
 

def process(command):
    if command['device'] == 'totem':
        return totem(command)
    if command['device'] == 'tweet':
        print("ooooooooooo")
        print(command)
        return tweet(command)