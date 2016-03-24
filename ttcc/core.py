# from test import *
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

# def parse_device(sentence):
#     words = sentence.split()
#     for word in words:
#         for device in DEVICES:
#             if word in DEVICES[device]['alias']:
#                 return device


# def parse_intent(sentence, operations):
#     intent = None
#     #operations = {_:0 for _ in operations.keys()}
#     for operation in operations:
#         for trigger in operations[operation]['triggers']: 
#             if re.search(trigger, sentence):
#                 intent = operation
#                 if intent != None:
#                     return intent
#     return intent
    
# def parse_args(sentence, arguments):
#     for arg in arguments.keys():
#         if arguments[arg]['type'] in different_types:
#             argument_values = arguments[arg]['type'].parse(sentence, arguments[arg]['unit'], intent)
#             return argument_values

def parse_device(sentence):
    # Capable of identifying multiple devices that may have been the target
    possible_targets = []
    for device_name in DEVICES.keys():
        device = DEVICES[device_name]
        aliases = device['alias']
        for alias in aliases:
            if re.search(alias, sentence):
                possible_targets.append((device_name, alias, aliases.index(alias), len(aliases)))
    print(possible_targets)
    return possible_targets

def parse_intent(sentence, operations):
    # Limited to one operation only. We can add conflict handling later if required
    for operation_name in operations.keys():
        operation = operations[operation_name]
        for trigger in operation['triggers']:
            if re.search(trigger, sentence):
                return {
                    'operation_name': operation_name,
                    'trigger': trigger,
                    'operation': operation
                }
                return (operation_name, trigger, operation)
    return None

def parse_args(sentence, intent):
    values = {}
    arguments = intent['operation']['arguments']
    for argument_name in arguments.keys():
        for regex in arguments[argument_name]:
            regex = replace_macro(regex, intent)
            regex = re.compile(regex)
            print(regex)
            value = re.search(regex, sentence)
            if value:
                values[argument_name] = value.group(argument_name)
    print(values)
    return values

def parse(sentence):
    devices = parse_device(sentence)
    if devices == []: # If no device was matched
        return {'message': 'No devices matched'}
    elif len(devices) > 1: # If more than one device and/or alias was found
        target_device = select_device(devices)
        print(target_device)
    else:
        target_device = devices[0][0]

    
    operations = DEVICES[target_device]['operations']
    intent = parse_intent(sentence, operations)
    print(intent)
    if intent is None:
        print("error")
        return {'error':True}
        pass # Return something like {'error': True} or return None]

    arguments = intent['operation']['arguments']
    print(arguments)
    argument_values = parse_args(sentence, intent)
    
    response = {
        'device': target_device,
        'intent': intent['operation_name'],
        'arguments': argument_values
    }
    return response



# result = parse("get temperature of fridge in kelvin")
# print(result)

def replace_macro(regex, intent):
    while True:
        try:
            start = regex.index('{{')
            
            end = regex.index('}}')
            print(start,end)
            if start < end:
                macro = regex[start+2:end]
                if macro == 'trigger':
                    regex = regex[:start] + intent['trigger'] + regex[end+2:]
                    print(regex)
        except ValueError:
            # Substitution is done
            # print(regex)
            return regex


def select_device(devices):
    # Need an algorithm to pick one of many devices
    return devices[0][0]

