from django.conf.urls import url
from django.contrib import admin
from . import views

app_name = 'game'

urlpatterns = [
    # Model Manipulation Endpoints
    url(r'^campaigns/$', views.CampaignsListView.as_view(), name="campaigns"),
    url(r'^campaigns/(?P<pk>[0-9]+)/$', views.PlayCampaignView.as_view(), name="play_campaign"),
    url(r'^campaigns/start/$', views.start_campaign, name="start_campaign"),
    url(r'^campaigns/(?P<campaign_id>[0-9]+)/scores/$', views.get_scores, name="get_scores"),
    url(r'^campaigns/(?P<campaign_id>[0-9]+)/scores/create/$', views.create_score, name="create_score"),
    url(r'^campaigns/(?P<campaign_id>[0-9]+)/cities/$', views.get_cities, name="get_cities"),
    url(r'^campaigns/(?P<campaign_id>[0-9]+)/cities/(?P<city_id>[0-9]+)/toggle-fade/$', views.toggle_fade, name="toggle_fade"),

    url(r'^', views.IndexView.as_view(), name="index"),
]

