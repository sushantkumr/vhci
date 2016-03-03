# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

from flask import Flask, request, jsonify, redirect, url_for, render_template
from ttcc import core
import devices

app = Flask(__name__)

def setup():
    core.register('totem', devices.totem)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/getStatus')
def status():
    return jsonify(FRIDGE)

@app.route('/command', methods=['POST'])
def command():
    command = request.form['command']
    try:
        result = core.parse(command)
        print(result)
        # Call a function to execute the command
        # execute(result)
        return jsonify(result)
    except:
        error = {
            'error': True,
            'message': 'Parse failure'
        }
        return jsonify(error)

if __name__ == '__main__':
    setup()
    app.run(host='0.0.0.0', debug=True)
