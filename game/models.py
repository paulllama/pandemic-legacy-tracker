# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class Color:
    red = 'r'
    blue = 'u'
    yellow = 'y'
    black = 'b'


COLORS = (
    (Color.red, 'Red'),
    (Color.blue, 'Blue'),
    (Color.yellow, 'Yellow'),
    (Color.black, 'Black'),
)


class Season:
    one = 1
    two = 2

    def __init__(self, value):
        self.value = value
        self.name = {
            1: 'Season 1',
            2: 'Season 2',
        }[self.value]

    def __str__(self):
        return self.name



SEASONS = (
    (Season.one, 'Season 1'),
    (Season.two, 'Season 2'),
)


class Campaign(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    season = models.IntegerField(choices=SEASONS)
    date_created = models.DateTimeField()

    # class Meta:
    #     unique_together = ('season', 'user')

    def __str__(self):
        return "%s" % self.season

    def to_json(self):
        return dict(
            season=self.season,
            date_created=self.date_created,
            id=self.id
        )


class Score(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    month = models.IntegerField()
    win = models.BooleanField()

    def __str__(self):
        return "Month %s" % self.month


class City(models.Model):
    campaign = models.ForeignKey(Campaign, default=None, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=1, choices=COLORS)
    is_faded = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "cities"

    def __str__(self):
        return self.name

    def to_json(self):
        return dict(
            name=self.name,
            color=self.color,
            is_faded=self.is_faded,
            id=self.id
        )
