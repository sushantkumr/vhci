# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

totem = {
    'alias': ['totem', 'video player', 'media player', 'total'],
    'operations': {
        '--play': {
            'triggers': [r'play music', r'play video', r'play playlist', r'play songs?', r'play'],
            'arguments':{
                'name': ['{{trigger}}(?P<name>( .*)?)'],
            },
            'confirm': False
        },
        '--pause': {
            'triggers': [r'pause'],
            'arguments': {
            },
            'confirm': False
        },
        '--play-pause': {
            'triggers': [r'toggle'],
            'arguments': {
            },
            'confirm': False
        },
        '--stop': {
            'triggers': [r'stop'],
            'arguments': {
            },
            'confirm': False
        },
        '--next': {
            'triggers': [r'next'],
            'arguments': {
            },
            'confirm': False
        },
        '--previous': {
            'triggers': [r'previous'],
            'arguments': {
            },
            'confirm': False
        },
        '--volume-up': {
            'triggers': [r'increase volume'],
            'arguments': {
            },
            'confirm': False
        },
        '--volume-down': {
            'triggers': [r'decrease volume'],
            'arguments': {
            },
            'confirm': False
        },
        '--mute': {
            'triggers': [r'mute'],
            'arguments': {
            },
            'confirm': False
        },
        '--fullscreen': {
            'triggers': [r'fullscreen'],
            'arguments': {
            },
            'confirm': False
        },
        '--quit': {
            'triggers': [r'quit', r'quick'],
            'arguments': {
            },
            'confirm': True,
            'message': 'Do you want to quit totem? (yes/no)'
        },
        'examples_intent':{
            'triggers':[r'none'],
            'arguments':{
                'example':['The possible intents are play, pause', 'Example: play "some file"'],
                'message':'No intent provided'
            },
            'confirm':False
        },
        'examples_arguments':{
            'triggers':[r'none'],
            'arguments':{
                'example':['Example: play filename'],
                'message':'No arguments provided'
            },
            'confirm':False
        },
    }
} #20 words

tweet = {
    'alias' : ['tweet'],
    'operations' : {
        'search/tweets': {
            'triggers': [r'on', r'about'],
            'arguments':{
                 'name': ['{{trigger}}(?P<name>( .*)?)'] # r'on microsoft' 
            },
            'confirm': False
        },
        'statuses/user_timeline': {
            'triggers': [r'of', r'by'],
            'arguments':{
                'name': ['{{trigger}}(?P<name>( .*)?)']
            },
            'confirm': False
         },
         'trends/place':{
            'triggers': [r'from', r'trending in'],
            'arguments':{
                'name': ['{{trigger}}(?P<name>( .*)?)']
            },
            'confirm':False
         },
        'examples_intent':{
            'triggers':[r'none'],
            'arguments':{
                'example':['the possible intents are \'on\', \'by\'', 'Example: tweets by "@somename"'],
                'message':'no intent provided'
            },
            'confirm':False
        },
        'examples_arguments':{
            'triggers':[r'none'],
            'arguments':{
                'example':['Example: tweets by "@somename"'],
                'message':'no arguments provided'
            },
            'confirm':False
        }
    }
} #8

# Core game code for tetris from https://github.com/jakesgordon/javascript-tetris
tetris = {
    'alias': ['tetris'],
    'operations': {
        '--play': {
            'triggers': [r'tetris'],
            'arguments': {
                'name': ['{{trigger}}(?P<name>( .*)?)'],
            },
            'confirm': False,
        }
    }
} # 6+1(tetris)

#Soundcloud Docs can be found at https://developers.soundcloud.com/
soundcloud = {
    'alias': [r'soundcloud', r'sound cloud'],
    'operations': {
        '--pause': {
            'triggers': [r'pause'],
            'arguments': {
            },
            'confirm': False
        },
        '--play': {
            'triggers': [r'play'],
            'arguments': {
            },
            'confirm': False
        },
        '--play-song': {
            'triggers': [r'xyz'],
            'arguments': {
            },
            'confirm': False
        },
        '--play-pause': {
            'triggers': [r'toggle'],
            'arguments': {
            },
            'confirm': False
        },
        '--list': {
            'triggers': [r'list', r'search'],
            'arguments': {
                'name': ['{{trigger}}(?P<name>( .*)?)'],
            },
            'confirm': False,
        },
        '--quit': {
            'triggers': [r'quit','quiz', 'quick'],
            'arguments': {
            },
            'confirm': False,
        },
        'examples_intent':{
            'triggers':[r'none'],
            'arguments':{
                'example':['The possible intents are play, pause, list', 'Example: soundcloud list "name"'],
                'message':'No intent provided'
            },
            'confirm':False
        },
        'examples_arguments':{
            'triggers':[r'none'],
            'arguments':{
                'example':['Example: soundcloud list filename'],
                'message':'No arguments provided'
            },
            'confirm':False
        },        
    }
}

weather = {
    'alias' : ['forecast'],
    'operations' : {
        'minTemperature':{
            'triggers':[r'min[a-z]* temp[a-z]*'],
            'arguments':{
            },
            'confirm':False,
        },
        'maxTemperature':{
            'triggers':[r'max[a-z]* temp[a-z]*'],
            'arguments':{
            },
            'confirm':False,
        },
        'need':{
            'triggers':[r'need an umbrella'],
            'arguments':{
            },
             'confirm':False,
        },
        'will':{
            'triggers':[r'(rain|cloudy|sunny)'],
            'arguments':{
            },
            'confirm':False,
        },
        'windspeed':{
            'triggers':[r'wind speed'],
            'arguments':{
            },
            'confirm':False,
        },
        'humidity':{
            'triggers':[r'humidity'],
            'arguments':{
            },
            'confirm':False,
        },
        'weather':{
            'triggers':[r'weather', r'whether'],
            'arguments':{
            },
            'confirm':False,
        },
        'reset':{
            'triggers':[r'reset city'],
            'arguments':{

            },
            'confirm':False
        },
        'set city':{
            'triggers':[r'set city( to)?', r'change city( to)?'],
            'arguments':{
                'name': ['{{trigger}}(?P<name>( .*)?)']
            },
            'confirm':False
        },
        'examples_intent':{
            'triggers':[r'none'],
            'arguments':{
                'example':['The possible intents are max temperature, min temperature', 'Example: forecast max temperature'],
                'message':'No intent provided'
            },
            'confirm':False
        },        
    }
}


#Explore and traverse the various directories in a UNIX system
file_explorer = {
    'alias': ['file explorer'],
    'operations': {
        '--goto': {
            'triggers': [r'go to', r'goto'],
            'arguments': {
                'name': ['{{trigger}}(?P<name>( .*)?)'],
            },
            'confirm': False,
        },
        '--step-into': {
            'triggers': [r'step into', r'move into', r'move to'],
            'arguments': {
                'name': ['{{trigger}}(?P<name>( .*)?)'],
            },
            'confirm': False,
        },
        '--move-up': {
            'triggers': [r'move up', r'level up'],
            'arguments': {
            },
            'confirm': False,
        },
        '--display': {
            'triggers': [r'display contents', r'show contents'],
            'arguments': {
            },
            'confirm': False,
        },
        '--display-files': {
            'triggers': [r'display files', r'show files'],
            'arguments': {
            },
            'confirm': False,
        },
        '--display-dir': {
            'triggers': [r'display directories', r'show directories', r'display folders', r'show folders'],
            'arguments': {
            },
            'confirm': False,
        },
        '--hidden': {
            'triggers': [r'display hidden contents', r'show hidden contents'],
            'arguments': {
            },
            'confirm': False,
        },
        '--hidden-files': {
            'triggers': [r'display hidden files', r'show hidden files'],
            'arguments': {
            },
            'confirm': False,
        },
        '--hidden-dir': {
            'triggers': [r'display hidden directories', r'show hidden directories', r'display hidden folders', r'show hidden folders'],
            'arguments': {
            },
            'confirm': False,
        },
        '--current-path': {
            'triggers': [r'current path'],
            'arguments': {
            },
            'confirm': False,
        },
        '--reset-path': {
            'triggers': [r'reset path', r'clear path', r'reset'],
            'arguments': {
            },
            'confirm': False,
        },
        'examples_intent':{
            'triggers':[r'none'],
            'arguments':{
                'example':['The possible intents are display, goto, current path ', 'Example: file explorer display contents'],
                'message':'No intent provided'
            },
            'confirm':False
        },
        'examples_arguments':{
            'triggers':[r'none'],
            'arguments':{
                'example':['Example: goto home'],
                'message':'No arguments provided'
            },
            'confirm':False
        }
    }
}

