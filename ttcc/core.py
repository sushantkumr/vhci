import re

DEVICES = {}

def register(device_name, device_details):
    global DEVICES
    # Overwrite or ignore a duplicate registration?
    # Check if the device details is in the correct format
    # Check if type is an object of a subclass of TypeBaseClass
    DEVICES[device_name] = device_details

def parse_device(sentence):
    pass

def parse_intent(sentence, operations):
    pass

def parse_args(sentence, arguments):
    pass

def parse(sentence):
    device = parse_device(sentence)
    if device is None:
        pass # Return something like {'error': True} or return None

    operations = DEVICES[device]['operations']
    intent = parse_intent(sentence, operations)
    if intent is None:
        pass # Return something like {'error': True} or return None

    arguments = DEVICES[device][intent]['arguments']
    argument_values = parse_args(sentence, arguments)

    response = {
        'device': device,
        'intent': intent,
        'arguments': argument_values
    }
    return response
