from abc import ABCMeta, abstractmethod

class TypeBaseClass(metaclass=ABCMeta): # Abstract class that other types have to inherit from
    @abstractmethod
    def parse(self, *args, **kwargs):
        pass

class Temperature(TypeBaseClass):
    def parse(self, sentence, unit):
        match = re.search(r'([0-9]+(\.)?[0-9]+) (degrees )?(celsius|fahrenheit|centigrade|kelvin)?', sentence)
        if match is None:
            print('Temperature couldn\'t be parsed')
            return

        match = match.group()
        temperature = re.search(r'([0-9]+(\.)?[0-9]+)', match).group()
        # print(temperature)
        if 'celsius' in sentence:
            unit = 'celsius'
        elif 'fahrenheit' in sentence:
            unit = 'fahrenheit'

        response = {
            'temperature': float(temperature),
            'unit': unit
        }

        return response

class Items(TypeBaseClass):
    def __init__(self):
        pass

    def parse():
        pass

class Number(TypeBaseClass):
    def parse(self):
        pass
