from abc import ABCMeta, abstractmethod
import re

current_temperature=0
current_unit=''

class TypeBaseClass(metaclass=ABCMeta): # Abstract class that other types have to inherit from
    @abstractmethod
    def parse(self, *args, **kwargs):
        pass

class Temperature(TypeBaseClass):
    def parse(self, sentence, unit, intent):
        global current_temperature 
        global current_unit

        get_unit = sentence.split()
        if 'celsius' in get_unit:
            unit = 'celsius'

        elif 'fahrenheit' in get_unit:
            unit = 'fahrenheit'

        elif 'kelvin' in get_unit:
            unit = 'kelvin'

        elif 'centigrade' in get_unit:
            unit = 'centigrade'

        if intent != 'getTemperature':
            match = re.search(r'([0-9])+(\.)?([0-9]+)?( degree| degrees)?( celsius| fahrenheit| kelvin| centigrade)?', sentence)
            if match is None:
                print('Temperature couldn\'t be parsed')
                return

            match = match.group()
            temperature = re.search(r'([0-9])+(\.)?([0-9]+)?', match).group()

        if intent == 'setTemperature':
            current_temperature = float(temperature)

        elif intent == 'increaseTemperature':
            current_temperature = current_temperature + float(temperature)

        elif intent == 'decreaseTemperature':
            current_temperature = current_temperature - float(temperature)

        elif intent == 'getTemperature':
            if current_unit == unit:
                pass
            else:
                #convert_temperature(unit, current_unit)
                pass

        response = {
            'temperature': current_temperature,
            'unit': unit
        }

        current_unit = unit
        return response

class Items(TypeBaseClass):
    def __init__(self):
        pass

    def parse():
        pass

class Number(TypeBaseClass):
    def parse(self):
        pass

'''te = Temperature()
resul = te.parse("set temperature to 150.0 kelvin","celcius",'setTemperature')
print(resul)

resul = te.parse("increase temperature by 2 degree ","celcius",'increaseTemperature')
print(resul)

resul = te.parse("DECREASE temperature by 2 degree ","celcius",'decreaseTemperature')
print(resul)

resul = te.parse("get temperature in kelvin","celcius",'getTemperature')
print(resul)

resul = te.parse("get temperature","celcius",'getTemperature')
print(resul)

resul = te.parse("decrase temperature by 2 degree ","celcius",'decreaseTemperature')
print(resul)'''