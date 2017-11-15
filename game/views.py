# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.views import generic
import json
import season
from game.models import City, Campaign, Score
from pandemic_legacy_tracker_com.settings import MIN_PASSWORD_LENGTH


class IndexView(generic.TemplateView):
    template_name = "game/index.html"


class AboutView(generic.TemplateView):
    template_name = "game/about.html"


@login_required
def campaign_list(request):
    campaigns_by_season = {}

    for index, name in season.all_choices:
        campaigns_by_season[index] = None

    for campaign in Campaign.objects.filter(user=request.user):
        campaigns_by_season[campaign.season] = campaign

    return render(request, "game/pick-campaign.html", {
        'campaigns': campaigns_by_season,
        'seasons': season.all_choices
    })


@login_required
def play_campaign(request, season_index):
    campaign = Campaign.objects.filter(user=request.user, season=season_index)

    if campaign is None:
        campaign = Campaign(season=season_index, date_created=timezone.now())
        campaign.save()

    render(request, "game/play.html", {
        'campaign': campaign
    })


class PlayCampaignView(LoginRequiredMixin, generic.DetailView):
    template_name = "game/play.html"
    model = Campaign
    context_object_name = "campaign"


@login_required
def get_cities(request, campaign_id):
    cities = [city.to_json() for city in City.objects.filter(campaign=campaign_id)]
    return JsonResponse(list(cities), safe=False)


@login_required
def toggle_fade(request, campaign_id, city_id):
    city = get_object_or_404(City, id=city_id)
    city.is_faded = not city.is_faded
    city.save()

    return JsonResponse({})


@login_required
def get_scores(request, campaign_id):
    scores = Score.objects.filter(campaign=campaign_id).get("month", "win")
    return JsonResponse(list(scores), safe=False)


@login_required
def create_score(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)

    score = Score()
    score.campaign_id = campaign
    score.month = request.GET['month']
    score.win = request.GET['win']

    score.save()
    return JsonResponse({})


def create_account(request):
    if "POST" == request.method:
        try:
            post_body = json.loads(request.body)

            email = post_body['username']
            password = post_body['password']

            if len(password) < MIN_PASSWORD_LENGTH:
                return create_json_error('Password must be %s characters long' % MIN_PASSWORD_LENGTH)

            new_user = User.objects.create_user(username=email, email=email, password=password)
            new_user.save()

            login(request, new_user)

            return JsonResponse({})

        except MultiValueDictKeyError:
            return JsonResponse({
                'error': 'Username and password are required'
            })
    else:
        return render(request, 'game/create-account.html')


def do_login(request):
    if 'POST' == request.method:
        post_body = json.loads(request.body)

        email = post_body['username']
        password = post_body['password']
        user = authenticate(username=email, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({})
        else:
            return create_json_error('Username or password is invalid')

    else:
        return render(request, 'game/login.html')


def do_logout(request):
    logout(request)
    return redirect("/")


def create_json_error(message):
    return JsonResponse({
        'error': message
    })