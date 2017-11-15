# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from game.default_cities import season_1_cities, season_1_city_frequency, season_2_cities, season_2_city_frequency
from django.db.models.signals import post_save
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


@receiver(post_save, sender=Campaign)
def create_default_cities(sender, instance, created, **kwargs):
    if created:
        default_cities = None
        default_frequency = 0

        if season.one.key is instance.season:
            default_cities = season_1_cities
            default_frequency = season_1_city_frequency
        elif season.two.key is instance.season:
            default_cities = season_2_cities
            default_frequency = season_2_city_frequency

        for city_color, cities in default_cities.iteritems():
            for city_name in cities:
                city = City(name=city_name, color=city_color, campaign=instance, frequency=default_frequency)
                city.save()


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
    frequency = models.IntegerField(default=1)

    class Meta:
        verbose_name_plural = "cities"

    def __str__(self):
        return self.name

    def to_json(self):
        return dict(
            name=self.name,
            color=self.color,
            is_faded=self.is_faded,
            id=self.id,
            frequency=self.frequency
        )
