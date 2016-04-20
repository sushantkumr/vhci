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
    '''
    Register devices with the core parser
    '''
    core.register('totem', devices.totem)
    core.register('tweet', devices.tweet)
    core.register('tetris', devices.tetris)
    core.register('soundcloud',devices.soundcloud)
    core.register('file_explorer',devices.file_explorer)
    core.register('weather', devices.weather)

@app.route('/')
def home():
    '''
    The homepage
    '''
    return render_template('home.html')

@app.route('/tetris')
def tetris():
    '''
    Tetris window
    '''
    return render_template('tetris.html')

def execution_handler(result, device, output):
    '''
    Calls the execution module
    '''
    execution_result = execute.process(result, device, output)
    return execution_result

@app.route('/command', methods=['POST'])
def command():
    '''
    Recevies commands from the client, parses it and takes appropriate action.
    '''

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

    command = request.form['input'] # The input command
    newCommand = request.form['newCommand'] # Flag indicating whether the command is new or a continuation
    oldResult = json.loads(request.form['oldResult']) # Any old results if the command is a continuation

    output['commands'].append(command)

    try:
        result, device, output = core.parse(command, newCommand, oldResult, output)
        output['parsed'] = result
        if output['parsed']['intent'] == None: # no intent given, so ask user to give one
            output['final'] = False
            output['type'] = 'continue' # user needs to provide the correct command
            output['example'] = device['operations']['examples_intent']['arguments']['example'] # provide the required message and
            output['message'] = device['operations']['examples_intent']['arguments']['message'] # example in devices.py
            return jsonify(output)
        
        if device['operations'][result['intent']]['confirm'] == True:
            if 'cancel' in output.keys():
                return jsonify(output)

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
