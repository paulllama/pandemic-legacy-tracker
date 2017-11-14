from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views

app_name = 'game'

urlpatterns = [
    url(r'^create-account/$', views.create_account, name='create_user'),
    url(r'^login/$', views.do_login, name='login'),
    url(r'^logout/$', views.do_logout, name='logout'),

    # Model Manipulation Endpoints
    url(r'^campaigns/$', views.campaign_list, name="campaigns"),
    url(r'^campaigns/season-(?P<season_id>[0-9]+)/$', views.play_campaign, name="play_campaign"),
    url(r'^campaigns/season-(?P<season_id>[0-9]+)/scores/$', views.get_scores, name="get_scores"),
    url(r'^campaigns/season-(?P<season_id>[0-9]+)/scores/create/$', views.create_score, name="create_score"),
    url(r'^campaigns/season-(?P<season_id>[0-9]+)/cities/$', views.get_cities, name="get_cities"),
    url(r'^campaigns/season-(?P<season_id>[0-9]+)/cities/(?P<city_id>[0-9]+)/toggle-fade/$', views.toggle_fade, name="toggle_fade"),

    url(r'^$', views.IndexView.as_view(), name="index"),
]

