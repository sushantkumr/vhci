def text2int(textnum, numwords={}):
    # If the input is already a number we don't have to go through this process
    # Eg: text2int('34') -> 34
    try:
        return int(textnum)
    except:
        pass

    if not numwords:
        units = [
        "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
        "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
        "sixteen", "seventeen", "eighteen", "nineteen",
        ]

        tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]

        scales = ["hundred", "thousand", "million", "billion", "trillion"]

        numwords["and"] = (1, 0)
        # (idx, word) like (0, "zero"), (2, "twenty") etc
        # numwords["zero"] = (1, 0)
        # numwords["twenty"] = (1, 20)
        # numwords["hundred"] = (1, 100)
        for idx, word in enumerate(units): numwords[word] = (1, idx)
        for idx, word in enumerate(tens): numwords[word] = (1, idx * 10)
        for idx, word in enumerate(scales): numwords[word] = (10 ** (idx * 3 or 2), 0)

    ordinal_words = {'first':1, 'second':2, 'third':3, 'fifth':5, 'eighth':8, 'ninth':9, 'twelfth':12}
    ordinal_endings = [('ieth', 'y'), ('th', '')]

    textnum = textnum.replace('-', ' ')

    current = result = 0
    for word in textnum.split():
        if word in ordinal_words: # first, second etc
            scale, increment = (1, ordinal_words[word])
        else:
            for ending, replacement in ordinal_endings: # tenth -> ten, twentieth -> twenty
                if word.endswith(ending):
                    word = "%s%s" % (word[:-len(ending)], replacement)

            if word not in numwords: # Ignore words like "option" etc
                continue

            scale, increment = numwords[word]

        current = current * scale + increment
        if scale > 100: # If thousand etc, store value and continue from 0
            result += current
            current = 0

    number = result + current

    # If "hello world" return None
    # If "zero" return 0
    if number == 0 and 'zero' not in textnum:
        return None

    return number
