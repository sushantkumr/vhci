import re
sentence = "get temperature 88 celcius"
d= re.search(r'([0-9]+(\.)?[0-9]+)( degree| degrees)?( in)?( celcius| fahrenheit| kelvin| centigrade)?',sentence)
print(d)