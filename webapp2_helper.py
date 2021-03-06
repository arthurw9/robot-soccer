import jinja2
import os
import webapp2

from google.appengine.api import users


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class RequestHandler2(webapp2.RequestHandler):

  def get(self):
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri));
      return
    template_data = {}
    template_data['user'] = user;
    template_data['logout_url'] = users.create_logout_url(self.request.uri)
    self.get2(template_data)

  def post(self):
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri));
      return
    template_data = {}
    template_data['user'] = user;
    template_data['logout_url'] = users.create_logout_url(self.request.uri)
    self.post2(template_data)
