from google.appengine.ext import ndb

import db_helper
import webapp2_helper


class SelectTeam(webapp2_helper.RequestHandler2):
  
  def get2(self, template_data):
    robot_query = db_helper.Player.query(ancestor=db_helper.parent_key())
    robot_list = robot_query.fetch()
    template_data['robot_list'] = robot_list
    template_data['red_team'] = [ "R" + str(x) for x in [1,2,3] ]
    template_data['blue_team'] = [ "B" + str(x) for x in [1,2,3] ]
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('select_team.html')
    self.response.write(template.render(template_data));


class Play(webapp2_helper.RequestHandler2):
  
  def post2(self, template_data):
    robots = {}
    for r in [ t + str(x) for t in ['R', 'B'] for x in [1,2,3] ]:
      p = db_helper.Player(id=self.request.get(r),
                           parent=db_helper.parent_key());
      p = p.key.get()
      robots[r] = p;
    template_data['robots'] = robots
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('play.html')
    self.response.write(template.render(template_data));
