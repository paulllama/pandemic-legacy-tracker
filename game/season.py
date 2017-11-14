class Season:
    def __init__(self, key):
        self.key = key
        self.name = {
            1: 'Season 1',
            2: 'Season 2',
        }[self.key]

    def to_tuple(self):
        return self.key, self.name


one = Season(1)
two = Season(2)

all_choices = (
    one.to_tuple(),
    two.to_tuple(),
)
