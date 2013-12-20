from google.appengine.ext import ndb

import db_helper
import webapp2_helper


class NewRobot(webapp2_helper.RequestHandler2):
  
  def get2(self, template_data):
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('new_robot.html')
    self.response.write(template.render(template_data));


class SaveRobot(webapp2_helper.RequestHandler2):
  
  def post2(self, template_data):
    p = db_helper.Player(id=self.request.get("robot_name"), 
                         parent=db_helper.parent_key());
    p.player_name = self.request.get("robot_name");
    p.program = self.request.get("robot_code");
    p.put();
    self.redirect('/list_robots');


class ListRobots(webapp2_helper.RequestHandler2):
  
  def get2(self, template_data):
    robot_query = db_helper.Player.query(ancestor=db_helper.parent_key())
    robot_list = robot_query.fetch()
    template_data['robot_list'] = robot_list
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('list_robots.html')
    self.response.write(template.render(template_data));


class EditRobot(webapp2_helper.RequestHandler2):

  def get2(self, template_data):
    k = ndb.Key(urlsafe=self.request.get("k"))
    p = k.get();
    template_data['player'] = p
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('edit_robot.html')
    self.response.write(template.render(template_data));


class DeleteRobot(webapp2_helper.RequestHandler2):
  
  def get2(self, template_data):
    k = ndb.Key(urlsafe=self.request.get("k"))
    k.delete();
    self.redirect('/list_robots');
