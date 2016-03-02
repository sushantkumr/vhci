# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

from ttcc import types

refrigerator = {
    'alias': ['refrigerator', 'fridge'],
    'operations': {
        'setTemperature': {
            'triggers': [r'set [a-z]* ?temperature'], # Use regex to allow complex phrases
            'arguments': {
                'target_temperature': {
                    'multiple': False, # Can use somethig like this to fetch more than one item from a sentence. eg: How many apples and oranges are left
                    'type': 'temperature', # Make a list of commonly used units so that we can parse it by making rules such as "... X degrees celsius ..." where X will be fetched.
                    'unit': 'celsius' # This will be the default, can change it if it's specified by the user
                }
            }
        },
        'getTemperature': {
            'triggers': [r'what is the temperature', r'get [a-z]* ?temperature'],
            'arguments': {}
        },
    },
}

# channels = types.Items([0, 1, 2, 3])
television = {
    'alias': ['television', 'tv'],
    'operations': {
        'mute': {
            'triggers': [r'mute', r'quite'],
            'arguments': {}
        },
        'setChannel': {
            'triggers': [r'go to', r'set channel'],
            'arguments': {
                'channel_number': {
                    'multiple': False,
                    'type': 'channel'
                }
            }
        }
    }
}
