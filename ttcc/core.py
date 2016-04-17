from ttcc import utils
import execute
import re

DEVICES = {}

def execution_handler(result, device, output): # had to use because of some conflict, maybe resolved later
    execution_result = execute.process(result, device, output)
    return execution_result

def register(device_name, device_details):
    global DEVICES
    DEVICES[device_name] = device_details

def parse_device(sentence):
    # Capable of identifying multiple devices that may have been the target
    possible_targets = []
    for device_name in DEVICES.keys():
        device = DEVICES[device_name]
        aliases = device['alias']
        for alias in aliases:
            if re.search(alias, sentence):
                sentence = sentence.replace(alias, device_name)
                possible_targets.append((device_name, alias, aliases.index(alias), len(aliases)))
    return possible_targets

def parse_intent(sentence, operations):
    # Limited to one operation only. We can add conflict handling later if required
    for operation_name in operations.keys():
        operation = operations[operation_name]
        for trigger in operation['triggers']:
            print(trigger)
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
            value = re.search(regex, sentence)
            if value:
                values[argument_name] = value.group(argument_name)
    return values

def parse(sentence, newCommand, oldResult, output):
    if newCommand == 'false' and oldResult['type'] == 'option': # when the given command has many options to deal with
        device = DEVICES[oldResult['parsed']['device']]
        if oldResult['option-type'] == 'arguments':
            try:
                print(oldResult['option-type'])
                optionSelected = utils.text2int(sentence) - 1
                oldResult['parsed']['arguments'][oldResult['option-name']] = oldResult['options'][optionSelected]
                return oldResult['parsed'] , device, output
            except:
                if oldResult['parsed']['device'] == 'soundcloud':
                    oldResult['parsed']['intent'] = '--list' # because in main.js the intent is set to --play
                return oldResult['parsed'], device, output
   
    if newCommand == 'false' and oldResult['type'] == 'confirm': # to deal with yes/no
        device = DEVICES[oldResult['parsed']['device']]
        if sentence.lower() in ['yes', 'yeah', 'yup', 'yep', 'ya', 'y'] :
            output = execution_handler(oldResult['parsed'], device, output)
            output['final'] = True
            output['parsed'] = oldResult['parsed']
            output['message'] = 'Executed command'
            output['dummy']='' # this dummy variable is to check whether the input is neither yes/no
            return oldResult['parsed'], device, output

        if sentence.lower() in ['nope', 'no','n']:
            output['final'] = True
            output['message'] = 'Execution Terminated'
            output['dummy']='' # this dummy variable is to check whether the input is neither yes/no
            return oldResult['parsed'], device, output

        return oldResult['parsed'], device, output

    else:
        devices = parse_device(sentence)
        if devices == []: # If no device was matched
            return {'message': 'No devices matched'}
        elif len(devices) > 1: # If more than one device and/or alias was found
            target_device = select_device(devices)
        else:
            target_device = devices[0][0]

        operations = DEVICES[target_device]['operations']
        intent = parse_intent(sentence, operations)
        if intent is None:
            return get_intent(target_device,output)

        arguments = intent['operation']['arguments']
        argument_values = parse_args(sentence, intent)
        if 'name' in arguments.keys():
            if re.match('^[ ]*$',argument_values['name']):
                argument_values['name'] = ''
                return get_arguments(target_device, intent, argument_values, output)
        
        if target_device == 'weather': # this is further processing of sentence  in execute.py
            output['input'] = sentence
        response = {
            'device': target_device,
            'intent': intent['operation_name'],
            'arguments': argument_values
        }
        device = DEVICES[target_device]
        return response, device, output

def replace_macro(regex, intent):
    while True:
        try:
            start = regex.index('{{')
            end = regex.index('}}')
            if start < end:
                macro = regex[start+2:end]
                if macro == 'trigger':
                    regex = regex[:start] + intent['trigger'] + regex[end+2:]
        except ValueError:
            return regex


def select_device(devices):
    # Need an algorithm to pick one of many devices
    return devices[0][0]

def get_intent(target_device, output): # called when no intent is mathced, ask user to provide one
    response = {
        'device':target_device,
        'intent':None,
        'arguments':''
    }
    device = DEVICES[target_device]
    return response, device, output

def get_arguments(target_device, intent, argument_values, output): # calls when no argument is given, ask user to provide
    response = {
        'device' : target_device,
        'intent' : intent['operation_name'],
        'arguments':argument_values
    }
    device = DEVICES[target_device]
    return response, device, output
