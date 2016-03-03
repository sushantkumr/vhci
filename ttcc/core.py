import re

DEVICES = {}

def register(device_name, device_details):
    global DEVICES
    # Overwrite or ignore a duplicate registration?
    # Check if the device details is in the correct format
    # Check if type is an object of a subclass of TypeBaseClass
    DEVICES[device_name] = device_details

def parse_device(sentence):
    # Capable of identifying multiple devices that may have been the target
    possible_targets = []
    for device_name in DEVICES.keys():
        device = DEVICES[device_name]
        aliases = device['alias']
        for alias in aliases:
            if re.search(alias, sentence):
                possible_targets.append((device_name, alias, aliases.index(alias), len(aliases)))
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
            value = re.search(regex, sentence)
            if value:
                values[argument_name] = value.group(argument_name)
    return values

def parse(sentence):
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
        return {'message': 'No intent matched'}

    arguments = intent['operation']['arguments']
    argument_values = parse_args(sentence, intent)

    response = {
        'device': target_device,
        'intent': intent['operation_name'],
        'arguments': argument_values
    }
    return response

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
            # Substitution is done
            return regex


def select_device(devices):
    # Need an algorithm to pick one of many devices
    return devices[0][0]
