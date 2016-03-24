# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

from flask import Flask, request, jsonify, redirect, url_for, render_template
from ttcc import core
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
    execution_result = execute.process(result)
    output['parsed'] = result
    return output

@app.route('/command', methods=['POST'])
def command():
    output = {
        'error': False, # Used in the catch block
        'final': True, # In the client we'll know if some more information is needed or if the command has been executed
        'parsed': {}, # Whatever has been parsed so far
        'message': '', # The message to be shown for interactive mode
    }

    command = request.form['input']
    oldResult = json.loads(request.form['oldResult'])
    newCommand = request.form['newCommand']

    if newCommand == 'false': # Handle interactive mode; doing only yes/no for now
        if command.lower() in ['yes', 'yeah', 'yup', 'yep', 'ya', 'y']:
            output = execution_handler(oldResult['parsed'], None, output) # Need to send device details instead of None

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

    try:
        result, device = core.parse(command)
        if device['operations'][result['intent']]['confirm'] == True:
            output['final'] = False
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
