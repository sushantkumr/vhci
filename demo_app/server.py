# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

from flask import Flask, request, jsonify, redirect, url_for, render_template
from ttcc import core
import devices
import execute
result = {}

app = Flask(__name__)

def setup():
    core.register('totem', devices.totem)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/getStatus')
def status():
    return jsonify(FRIDGE)

@app.route('/execute',methods=['POST'])
def execut():
    global result
    command = request.form['command']
    if command == "yes":
        print("qwe")
        response = execute.process(result)
        print(response)
        return jsonify(response)
    else: 
        error = {
            'message': 'Enter the proper command again'
        }
        return jsonify(error)      



@app.route('/command', methods=['POST'])
def command():
    global result
    command = request.form['command']
    try:
        parsed = {}
        result = core.parse(command)
        print(result)
        parsed['confirm']="do you want to continue : yes/no"
        parsed['result']=result
        return jsonify(parsed)
        # Call a function to execute the command
        #response = execute.process(result)
        # return jsonify(response)
    except:
        error = {
            'error': True,
            'message': 'Parse failure'
        }
        return jsonify(error)

if __name__ == '__main__':
    setup()
    app.run(host='0.0.0.0', debug=True)
