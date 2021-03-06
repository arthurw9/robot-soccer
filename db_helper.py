from google.appengine.api import users
from google.appengine.ext import ndb


def parent_key():
  """Constructs a Datastore key for a user."""
  return ndb.Key('User', users.get_current_user().user_id())


class Player(ndb.Model):
  """Models an individual Player in Robot Soccer."""
  player_name = ndb.StringProperty(indexed=True)
  program = ndb.StringProperty(indexed=False)

