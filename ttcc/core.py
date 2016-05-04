from ttcc import utils
import execute
import re

DEVICES = {}

# Used to call the respective device function in execute.py
def execution_handler(result, device, output):
    execution_result = execute.process(result, device, output)
    return execution_result

#Used to register devices with their details
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
    # Limited to one operation.
    for operation_name in operations.keys():
        operation = operations[operation_name]
        for trigger in operation['triggers']:
            if re.search(trigger, sentence):
                return {
                    'operation_name': operation_name, # example : --play
                    'trigger': trigger,
                    'operation': operation # example : whole --play dict
                }
    return None

def parse_args(sentence, intent):
    values = {}
    arguments = intent['operation']['arguments']
    for argument_name in arguments.keys():
        for regex in arguments[argument_name]:
            regex = replace_macro(regex, intent)
            regex = re.compile(regex) # Convert string to regular expression
            value = re.search(regex, sentence)
            if value:
                values[argument_name] = value.group(argument_name)
    return values

def file_explorer_parser(operations, sentence):
    intent = None
    list_of_operations = [
        ['--goto', ['go to']],
        ['--step-into', ['step into', 'move into', 'move to']],
        ['--move-up', ['move up', 'level up']],
        ['--current-path', ['current path']],
        ['--reset-path', ['reset path']],
        ['--hidden-files', ['hidden files']],
        ['--hidden-dir', ['hidden directories', 'hidden folders']],
        ['--hidden', ['hidden', 'hidden contents']],
        ['--display-files', ['files']],
        ['--display-dir', ['directories', 'folders']],
        ['--display', ['display contents', 'show contents', 'list contents']],
    ]
    for i in list_of_operations:
        for j in i[1]:
            if j in sentence:
                intent = {
                    'trigger': j,
                    'operation_name': i[0],
                    'operation': DEVICES['file_explorer']['operations'][i[0]]
                }
                break
        if intent is not None:
            break
    return intent

def parse(sentence, newCommand, oldResult, currentSession, output):
    if newCommand == 'false' and oldResult['type'] == 'option': # When the given command has many options to deal with
        device = DEVICES[oldResult['parsed']['device']]

        if oldResult['option-type'] == 'arguments':
            try:
                optionSelected = utils.text2int(sentence) - 1
                oldResult['parsed']['arguments'][oldResult['option-name']] = oldResult['options'][optionSelected]
                output['matched'] = True
                return oldResult['parsed'] , device, output
            except:
                if oldResult['parsed']['device'] == 'soundcloud':
                    oldResult['parsed']['intent'] = '--list' # because in main.js the intent is set to --play
                return oldResult['parsed'], device, output

    # If the command is a confirmation for the previous command
    if newCommand == 'false' and oldResult['type'] == 'confirm':
        device = DEVICES[oldResult['parsed']['device']]
        if sentence.lower() in ['yes', 'yeah', 'yup', 'yep', 'ya', 'y']:
            # output = execution_handler(oldResult['parsed'], device, output)
            output['final'] = True
            output['parsed'] = oldResult['parsed']
            output['message'] = 'Executed command'
            temp = device
            temp['operations'][oldResult['parsed']['intent']]['confirm'] = False
            return oldResult['parsed'], temp, output

        if sentence.lower() in ['nope', 'no', 'n']:
            output['final'] = True
            output['message'] = 'Operation canceled'
            output['cancel'] = '' # The operations wasn't confirmed
            return oldResult['parsed'], device, output

        return oldResult['parsed'], device, output

    else:
        devices = parse_device(sentence)
        if devices == []: # If no device was matched
            target_device = currentSession
        elif len(devices) > 1: # If more than one device and/or alias was found
            target_device = select_device(devices)
        else:
            target_device = devices[0][0]
            if currentSession != '' and target_device != currentSession:
                response = {
                    'device': currentSession,
                    'intent': 'Unknown'
                }
                device = None
                output['message'] = 'Please start a new session to interact with another device'
                output['dont_execute'] = True
                return response, device, output

        operations = DEVICES[target_device]['operations']
        if target_device == 'file_explorer':
            intent = file_explorer_parser(operations, sentence)
        else:
            intent = parse_intent(sentence, operations)
        if intent is None:
            return get_intent(target_device,output)

        arguments = intent['operation']['arguments']
        argument_values = parse_args(sentence, intent)
        # if 'name' in arguments.keys():
        #     if re.match('^[ ]*$',argument_values['name']): # Removes redundant spaces
        #         argument_values['name'] = ''
        #         return get_arguments(target_device, intent, argument_values, output)

        response = {
            'device': target_device,
            'intent': intent['operation_name'],
            'arguments': argument_values
        }
        device = DEVICES[target_device]
        return response, device, output

def replace_macro(regex, intent):
    # return regex.replace('{{trigger}}', intent)
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
