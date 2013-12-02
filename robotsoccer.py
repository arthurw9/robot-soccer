import os
import urllib

from google.appengine.api import users
from google.appengine.ext import ndb
import jinja2
import webapp2


JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


def parent_key():
  """Constructs a Datastore key for a user."""
  return ndb.Key('User', users.get_current_user().user_id())


class Player(ndb.Model):
  """Models an individual Player in Robot Soccer."""
  player_name = ndb.StringProperty(indexed=True)
  program = ndb.StringProperty(indexed=False)


class MainPage(webapp2.RequestHandler):
  
  def get(self):
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri));
      return
    template_data = {}
    template_data['user'] = user;
    template_data['logout_url'] = users.create_logout_url(self.request.uri)
    template = JINJA_ENVIRONMENT.get_template('index.html')
    self.response.write(template.render(template_data));
  

class NewRobot(webapp2.RequestHandler):
  
  def get(self):
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri));
      return
    template_data = {}
    template_data['user'] = user;
    template_data['logout_url'] = users.create_logout_url(self.request.uri)
    template = JINJA_ENVIRONMENT.get_template('new_robot.html')
    self.response.write(template.render(template_data));
  
  def post(self):
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri));
      return
    p = Player(parent=parent_key());
    p.player_name = self.request.get("robot_name");
    p.program = self.request.get("robot_code");
    p.put();
    self.redirect('/');


class ListRobots(webapp2.RequestHandler):
  
  def get(self):
    user = users.get_current_user()
    if not user:
      self.redirect(users.create_login_url(self.request.uri));
      return
    template_data = {}
    template_data['user'] = user;
    template_data['logout_url'] = users.create_logout_url(self.request.uri)
    robot_query = Player.query(ancestor=parent_key())
    robot_list = robot_query.fetch()
    template_data['robot_list'] = robot_list
    template = JINJA_ENVIRONMENT.get_template('list_robots.html')
    self.response.write(template.render(template_data));


application = webapp2.WSGIApplication(
    [ ('/', MainPage),
      ('/list_robots', ListRobots),
      ('/new_robot', NewRobot), ],
    debug=True)
