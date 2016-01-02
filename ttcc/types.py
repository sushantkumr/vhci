from abc import ABCMeta, abstractmethod

class TypeBaseClass(metaclass=ABCMeta): # Abstract class that other types have to inherit from
    @abstractmethod
    def parse(self, *args, **kwargs):
        pass

class Temperature(TypeBaseClass):
    def parse():
        pass

class Items(TypeBaseClass):
    def __init__(self):
        pass

    def parse():
        pass

class Number(TypeBaseClass):
    def parse():
        pass
