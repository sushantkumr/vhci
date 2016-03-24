# This is because we have haven't pip installed ttcc and it's in the parent directory
import sys
sys.path.insert(0, '../')
######

from flask import Flask, request, jsonify, redirect, url_for, render_template
from ttcc import core
import devices
import execute

result ={}
app = Flask(__name__)

def setup():
    core.register('totem', devices.totem)
    core.register('tweet', devices.tweet)
    # core.register('wmplayer', devices.wmplayer)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/execute', methods=['POST'])
def execut():
    global result
    command = request.form['command']
    print(result)
    if command == 'yes':   # also put something that gives same meaning as 'yes'
        response = execute.process(result)
        print(response)
        return jsonify(response)
    else:
        error = {
            'message': 'Enter the proper command again '
        }
        return jsonify(error)
   

@app.route('/getStatus')
def status():
    return jsonify(FRIDGE)

@app.route('/command', methods=['POST'])
def command():
    global result
    command = request.form['command']
    print(command)
    try:
        parsed_result = {}
        result = core.parse(command)
        print(result.keys)
        if 'error' in result.keys():
            # raise Exception('ppp')
            parsed_result['result']={
            'error': True,
            'message': 'Parse failure'
                }
            pass
        else:
            parsed_result['result']=result
            parsed_result['confirm']="do you want to continue? yes/no"
        # Call a function to execute the command
        return jsonify(parsed_result)
        # response = execute.process(result)
        # print(response)
         # return jsonify(response)
    except :
        error = {
            'error': True,
            'message': 'Parse failure'
        }
        return jsonify(error)


if __name__ == '__main__':
    setup()
    app.run(host='0.0.0.0', debug=True)
