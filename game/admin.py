# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Campaign, City, Score

# Register your models here.
admin.site.register(City)
admin.site.register(Score)
admin.site.register(Campaign)
