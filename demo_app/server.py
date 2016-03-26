# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

from flask import Flask, request, jsonify, redirect, url_for, render_template
from ttcc import core, utils
import devices
import execute
import json

app = Flask(__name__)

def setup():
    core.register('totem', devices.totem)

@app.route('/')
def home():
    return render_template('home.html')

def execution_handler(result, device, output):
    execution_result = execute.process(result, device, output)
    return execution_result

@app.route('/command', methods=['POST'])
def command():

    # This object will be sent to the client
    output = {
        'commands': [],
        'error': False, # Used in the catch block
        'final': True, # In the client we'll know if some more information is needed or if the command has been executed
        'parsed': {}, # Whatever has been parsed so far
        'message': '', # The message to be shown for interactive mode
        'type': None, # Type of the next command is. Used if final is False.
                      # Can be one of confirm, option, intent, argument,
    }

    command = request.form['input']
    oldResult = json.loads(request.form['oldResult'])
    newCommand = request.form['newCommand']

    output['commands'].append(command)

    if newCommand == 'false' and oldResult['type'] == 'confirm': # Handle interactive mode; doing only yes/no for now
        device = core.DEVICES[oldResult['parsed']['device']]
        if command.lower() in ['yes', 'yeah', 'yup', 'yep', 'ya', 'y']:
            output = execution_handler(oldResult['parsed'], device, output) # Need to send device details instead of None

            # This should be done in execution_handler
            # These values may not always be the same
            # More info may be needed sometimes
            output['final'] = True
            output['parsed'] = oldResult['parsed']
            output['message'] = 'Executed command'
        elif command.lower() in ['nope', 'no', 'n']:
            output['final'] = True
            output['message'] = 'Execution terminated. Ready to receive a new command'
        else:
            return jsonify(oldResult)
        return jsonify(output)

    if newCommand == 'false' and oldResult['type'] == 'option':
        device = core.DEVICES[oldResult['parsed']['device']]
        if oldResult['option-type'] == 'arguments':
            try:
                optionSelected = utils.text2int(command) - 1
                oldResult['parsed']['arguments'][oldResult['option-name']] = oldResult['options'][optionSelected]
                output = execution_handler(oldResult['parsed'], device, oldResult)
                return jsonify(output)
            except:
                return jsonify(oldResult)

    try:
        result, device = core.parse(command)
        output['parsed'] = result
        if device['operations'][result['intent']]['confirm'] == True:
            output['final'] = False
            output['type'] = 'confirm'
            output['message'] = device['operations'][result['intent']]['message']
            output['parsed'] = result
            return jsonify(output)
        else:
            output = execution_handler(result, device, output)
            return jsonify(output)
    except:
        output = {
            'error': True,
            'final': True,
            'message': 'Something went wrong, please try again'
        }
        return jsonify(output)

if __name__ == '__main__':
    setup()
    app.run(host='0.0.0.0', debug=True)
