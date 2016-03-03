from test import *
import re
#DEVICES = {}

#objects of types
# temperature = Temperature()
# number = Number()

# different_types = [temperature,number]
DEVICES = {}
# DEVICES={   
# 'refrigerator' : {
#     'alias': ['refrigerator', 'fridge'],
#     'operations': {
#         'setTemperature': {
#             'triggers': [r'set [a-z]* ?temperature'], # Use regex to allow complex phrases
#             'arguments': {
#                 'target_temperature': {
#                     'required': True,
#                     'type': temperature, # Make a list of commonly used units so that we can parse it by making rules such as "... X degrees celsius ..." where X will be fetched.
#                     'unit': 'celsius' # This will be the default, can change it if it's specified by the user
#                 }
#             }
#         },
#         'getTemperature': {
#             'triggers': [r'what is the temperature', r'get [a-z]* ?temperature'],
#             'arguments': {}
#         }
#     }
# }}

def register(device_name, device_details):
    global DEVICES
    # Overwrite or ignore a duplicate registration?
    # Check if the device details is in the correct format
    # Check if type is an object of a subclass of TypeBaseClass
    DEVICES[device_name] = device_details

def parse_device(sentence):
    words = sentence.split()
    for word in words:
        for device in DEVICES:
            if word in DEVICES[device]['alias']:
                return device 


def parse_intent(sentence, operations):
    intent = None
    #operations = {_:0 for _ in operations.keys()}
    for operation in operations:
        for trigger in operations[operation]['triggers']: 
            if re.search(trigger, sentence):
                intent = operation
                if intent != None:
                    return intent
    return intent
    
def parse_args(sentence, arguments):
    for arg in arguments.keys():
        if arguments[arg]['type'] in different_types:
            argument_values = arguments[arg]['type'].parse(sentence, arguments[arg]['unit'], intent)
            return argument_values

def parse(sentence):
    device = parse_device(sentence)
    print("device "+device)
    if device is None:
        pass # Return something like {'error': True} or return None

    operations = DEVICES[device]['operations']
    intent = parse_intent(sentence, operations)
    print("intent "+intent)
    if intent is None:
        print("error")
        pass # Return something like {'error': True} or return None]

    arguments = DEVICES[device]['operations'][intent]['arguments']
    argument_values = parse_args(sentence, arguments)
    print(argument_values)

    response = {
        'device': device,
        'intent': intent,
        'arguments': argument_values
    }
    return response


# result = parse("get temperature of fridge in kelvin")
# print(result)