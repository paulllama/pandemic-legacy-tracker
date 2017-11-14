class Color:
    def __init__(self, key):
        self.key = key
        self.name = {
            'r': 'Red',
            'u': 'Blue',
            'b': 'Black',
            'y': 'Yellow',
        }[key]

    def to_tuple(self):
        return self.key, self.name


red = Color('r')
blue = Color('u')
black = Color('b')
yellow = Color('y')

all_choices = (
    red.to_tuple(),
    blue.to_tuple(),
    black.to_tuple(),
    yellow.to_tuple(),
)
