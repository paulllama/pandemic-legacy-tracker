# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from game.default_cities import season_1_cities
from django.db.models.signals import post_init
from django.dispatch import receiver
import season
import color


class Campaign(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    season = models.IntegerField(choices=season.all_choices)
    date_created = models.DateTimeField()

    class Meta:
        unique_together = ('season', 'user')

    def __str__(self):
        return "%s" % self.season

    def to_json(self):
        return dict(
            season=self.season,
            date_created=self.date_created,
            id=self.id
        )


@receiver(post_init, sender=Campaign)
def create_default_cities(sender, instance, **kwargs):
    for city_color, cities in season_1_cities.iteritems():
        for city_name in cities:
            city = City()

            city.name = city_name
            city.color = city_color
            city.campaign = instance

            # city.save()


class Score(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    month = models.IntegerField()
    win = models.BooleanField()

    def __str__(self):
        return "Month %s" % self.month


class City(models.Model):
    campaign = models.ForeignKey(Campaign, default=None, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=1, choices=color.all_choices)
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
