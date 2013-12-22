import webapp2

import db_helper
import webapp2_helper
import edit_robots
import play

class MainPage(webapp2_helper.RequestHandler2):
  
  def get2(self, template_data):
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('index.html')
    self.response.write(template.render(template_data));


class TutorialPage(webapp2_helper.RequestHandler2):
  
  def get2(self, template_data):
    template = webapp2_helper.JINJA_ENVIRONMENT.get_template('tutorial.html')
    self.response.write(template.render(template_data));


application = webapp2.WSGIApplication(
    [ ('/', MainPage),
      ('/tutorial', TutorialPage),
      ('/list_robots', edit_robots.ListRobots),
      ('/new_robot', edit_robots.NewRobot),
      ('/edit', edit_robots.EditRobot),
      ('/save_robot', edit_robots.SaveRobot),
      ('/delete', edit_robots.DeleteRobot),
      ('/select_team', play.SelectTeam),
      ('/play', play.Play),
    ],
    debug=True)
