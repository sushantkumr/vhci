import os    
from TwitterAPI import TwitterAPI    
   
consumer_key = "consumer_key"    
consumer_secret = "consumer_secret"    
access_token_secret = "access_token_secret"    
access_token_key = "acces_token_k"    
    
def totem(command):    
    names = "start wmplayer /playlist cortana"    
 # names += "C:\\Users\\Public\\Music\\pp"    
# filename = "\\Romeo.mp3"    
    # names+=filename    
    cl = 'totem ' + command['intent']    
    if command['intent'] == '--play':    
        if command['arguments']['name']:    
        # mutiple filenames and stuff aren't supported yet    
          # give the proper filename if you want to play something    
            cl += ' ' + command['arguments']['name']    
            print(cl)    
         #testing..................    
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
        query = 'screen_name'    
    else:    
        query = 'q'    
  
    try:    
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
    os.system('chcp 65001') # for windows user    
    if command['device'] == 'totem':    
        return totem(command)    
    if command['device'] == 'tweet':    
        return tweet(command)    




 
 
