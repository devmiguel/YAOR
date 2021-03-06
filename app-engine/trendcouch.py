from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
import os, cgi
from google.appengine.ext.webapp import template
from google.appengine.ext import db
import datetime
import random

import wsgiref.handlers
import gdata.youtube
import gdata.youtube.service
import gdata.alt.appengine

from django.utils import simplejson as json

class CentralPage(webapp.RequestHandler):
	def get(self):
		template_values = {}
		
		sy = SearchYoutube()
		template_values = sy.getVideos(self.request, self.response)
		
		path = os.path.join(os.path.dirname(__file__), 'trendcouch.html')
		self.response.out.write(template.render(path, template_values))				

		
class SearchYoutube():	
	def getVideos(self,request,response):
		#search_term = cgi.escape(self.request.get('search_query')).encode('UTF-8')
					
		client = gdata.youtube.service.YouTubeService()
		client.client_id = 'trendcouch'
		client.developer_key = 'AI39si75Zv0DHcFKMdaoonfVr6eZr3aXO013Ekwsh1aeR_9175FDC_xN0rViqMN6cM7V_eSkEeQB-KoQWz_eUdEnHJJH5YH6vA'
		client.restriction=request.remote_addr #restrict videos to user IP

		query = gdata.youtube.service.YouTubeVideoQuery()

		# Registered Youtube developer key for TrendCouch
		query.key = 'AI39si75Zv0DHcFKMdaoonfVr6eZr3aXO013Ekwsh1aeR_9175FDC_xN0rViqMN6cM7V_eSkEeQB-KoQWz_eUdEnHJJH5YH6vA'
		
		#if search_term:
		#	query.vq = search_term
		query.max_results = '20'
		query.orderby = 'viewCount'
		query.category = 'Music'
		query.restriction = str(request.remote_addr)
		#query.safeSearch = "strict"
		query.racy = 'exclude'
		response.headers["REMOTE_ADDR"]= query.restriction
		#query.location= self.request.location

		gdata.alt.appengine.run_on_appengine(client)
		feed = client.YouTubeQuery(query)

		r = random.randint(0,19)
		template_values = {
			"video_link" : feed.entry[r].id.text.split('/').pop()
			}		

		video_list = []#{"name":entry.title.text,"link":video_id}]
		for e in feed.entry:
			thumbnail = ''
			if len(e.media.thumbnail) >2:
				thumbnail = e.media.thumbnail[2].url
			video_list.append({"title":e.title.text,"link":e.id.text.split('/').pop(), "thumbnail": thumbnail, "query": request.remote_addr})
			
		return template_values
		#path = os.path.join(os.path.dirname(__file__), 'trendcouch.html')
		#response.out.write(template.render(path, template_values))
		
		#video_dic = {"videos": video_list}
		#self.response.out.write(json.dumps(video_dic))		
	def get(self):

		search_term = cgi.escape(self.request.get('search_query')).encode('UTF-8')
					
		client = gdata.youtube.service.YouTubeService()
		client.client_id = 'trendcouch'
		client.developer_key = 'AI39si75Zv0DHcFKMdaoonfVr6eZr3aXO013Ekwsh1aeR_9175FDC_xN0rViqMN6cM7V_eSkEeQB-KoQWz_eUdEnHJJH5YH6vA'
		client.restriction=self.request.remote_addr #restrict videos to user IP

		query = gdata.youtube.service.YouTubeVideoQuery()

		# Registered Youtube developer key for TrendCouch
		query.key = 'AI39si75Zv0DHcFKMdaoonfVr6eZr3aXO013Ekwsh1aeR_9175FDC_xN0rViqMN6cM7V_eSkEeQB-KoQWz_eUdEnHJJH5YH6vA'
		
		if search_term:
			query.vq = search_term
		query.max_results = '20'
		query.orderby = 'viewCount'
		query.category = 'Music'
		query.restriction = str(self.request.remote_addr)
		#query.safeSearch = "strict"
		query.racy = 'exclude'
		self.response.headers["REMOTE_ADDR"]= query.restriction
		#query.location= self.request.location

		gdata.alt.appengine.run_on_appengine(client)
		feed = client.YouTubeQuery(query)

		r = random.randint(0,19)
		template_values = {
			"video_link" : feed.entry[r].id.text.split('/').pop()
			}		

		video_list = []#{"name":entry.title.text,"link":video_id}]
		for e in feed.entry:
			thumbnail = ''
			if len(e.media.thumbnail) >2:
				thumbnail = e.media.thumbnail[2].url
			video_list.append({"title":e.title.text,"link":e.id.text.split('/').pop(), "thumbnail": thumbnail, "query": self.request.remote_addr})

		path = os.path.join(os.path.dirname(__file__), 'trendcouch.html')
		self.response.out.write(template.render(path, template_values))
		
		#video_dic = {"videos": video_list}
		#self.response.out.write(json.dumps(video_dic))


application = webapp.WSGIApplication(
                                 	[('/',CentralPage)
									 #('/search', SearchYoutube)
									],
                                     debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
