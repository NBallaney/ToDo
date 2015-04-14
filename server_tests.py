import helpers
import os
import server
import unittest
import tempfile


class serverTestCase(unittest.TestCase):
  # Called before each test.
  def setUp(self):
    # Create and initialize a temporary database using the tempfile module since SQLite3 is a file-based system.
    self.db_fd, server.app.config['DATABASE'] = tempfile.mkstemp()
    # Disables error catching during request handling to get better error reports when making test requests.
    server.app.config['TESTING'] = True
    self.app = server.app.test_client()
    with server.app.app_context():
      server.init_db()


  # Called after each test.
  def tearDown(self):
    os.close(self.db_fd)
    os.unlink(server.app.config['DATABASE'])


  # Function name should start with 'test' so that unittest runs it as a test.
  def test_config_settings(self):
    config = server.app.config
    assert os.path.exists('todos.db')
    assert config['TESTING']


  def test_empty_db(self):
    response = helpers.retrieve_todos(self)
    assert response == []


  def test_todo_create_and_retreive(self):
    helpers.create_todo(self, 1, 'Test 1')
    helpers.create_todo(self, 2, 'Test 2')
    response = helpers.retrieve_todos(self)

    assert response[0]['id'] == 1
    assert response[0]['text'] == 'Test 1'
    assert response[1]['id'] == 2
    assert response[1]['text'] == 'Test 2'


  def test_todo_update(self):
    id = 1 
    helpers.create_todo(self, id, 'Test 1')
    helpers.update_todo(self, id, 'Updated text')
    response = helpers.retrieve_todos(self)
    assert response[0]['id'] == id
    assert response[0]['text'] == 'Updated text'


  def test_todo_delete(self):
    id = 1 
    helpers.create_todo(self, id, 'Test 1')
    helpers.create_todo(self, id + 1, 'Test 2')
    helpers.delete_todo(self, id)
    response = helpers.retrieve_todos(self)
    isDeleted = True
    for todo in response:
      if todo['id'] == id:
        isDeleted = False
    assert isDeleted



if __name__ == '__main__':
  unittest.main()
