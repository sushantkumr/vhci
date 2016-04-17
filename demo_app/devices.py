# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

# from ttcc import test
# temperature = test.Temperature()

totem = {
    'alias': ['totem', 'video player', 'media player', 'total'],
    'operations': {
        '--play': {
            'triggers': [r'play music', r'play video', r'play playlist', r'play songs?', r'play '],
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
                'example':['the possible intents are play, pause', 'Example: play "some file"'],
                'message':'no intent provided'
            },
            'confirm':False
        },
        'examples_arguments':{
            'triggers':[r'none'],
            'arguments':{
                'example':['Example: play filename'],
                'message':'no arguments provided'
            },
            'confirm':False
        },
    }
}

tweet = {
    'alias' : ['tweet', 'tweets'],
    'operations' : {
        'search/tweets': {
            'triggers': [r'on', r'about'],
            'arguments':{
                 'name': ['{{trigger}}(?P<name>( .*)?)']
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
            'triggers': [r'in'],
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
        # 'example_intent':{
        #     1:'there is no intent, provide one',[r'^get [a-z ]*tweets$',r'^get [a-z ]*tweet$',r'^fetch [a-z ]*tweet$', r'^fetch [a-z ]*tweets$',r'^tweets$'],
        #     2:'the possible intents are \'on\', \'by\'',
        #     3:'Example: tweets by "@somename"'
        #     }
    }
}

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
}

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
            'triggers': [r'quit'],
            'arguments': {
            },
            'confirm': False,
        },
    }
}
