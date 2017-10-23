# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.views import generic

# Create your views here.
from game.default_cities import season_1_cities
from game.models import City, Campaign, Season, Score


class IndexView(generic.TemplateView):
    template_name = "game/index.html"


class CampaignsListView(generic.ListView):
    template_name = "game/pick-campaign.html"
    context_object_name = 'campaigns'
    queryset = Campaign.objects.all()


class PlayCampaignView(generic.DetailView):
    template_name = "game/play.html"
    model = Campaign
    context_object_name = "campaign"


def start_campaign(request):
    campaign = Campaign()
    campaign.season = Season.one
    campaign.date_created = timezone.now()

    campaign.save()

    for color, cities in season_1_cities.iteritems():
        for city_name in cities:
            city = City()

            city.name = city_name
            city.color = color
            city.campaign = campaign

            city.save()

    return JsonResponse({'id': campaign.id})


def get_cities(request, campaign_id):
    cities = [city.to_json() for city in City.objects.filter(campaign=campaign_id)]
    return JsonResponse(list(cities), safe=False)


def toggle_fade(request, campaign_id, city_id):
    city = get_object_or_404(City, id=city_id)
    city.is_faded = not city.is_faded
    city.save()

    return JsonResponse({})


def get_scores(request, campaign_id):
    scores = Score.objects.filter(campaign=campaign_id).get("month", "win")
    return JsonResponse(list(scores), safe=False)


def create_score(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)

    score = Score()
    score.campaign_id = campaign
    score.month = request.GET['month']
    score.win = request.GET['win']

    score.save()
    return JsonResponse({})
