import os
import server
import unittest
import tempfile
import json

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


  # Function name should start with 'test' so that unittest runs it automatically.
  def test_config_settings(self):
    config = server.app.config
    assert os.path.exists("todos.db")
    assert config['TESTING']


  def test_empty_db(self):
    response = self.app.get('/api')
    assert '[]' in response.data


  # Helper function to create todos.
  def create_todo(self, id, text):
    todo = {"text": text,
            "id": id}

    response = self.app.post('/api',
                              data=json.dumps(todo),
                              content_type='application/json')
    return response


  # Helper function to retrieve todos
  def retrieve_todos(self):
    response = self.app.get('/api')
    json_response = json.loads(response.data)
    return json_response




  def test_message_create(self):
    response = self.create_todo(1, "Test 1")
    assert '[]' not in response.data


  def test_messages_retreive(self):
    self.create_todo(1, 'Test 1')
    self.create_todo(2, 'Test 2')
    response = self.retrieve_todos()

    assert response[0]['id'] == 1
    assert response[0]['text'] == 'Test 1'
    assert response[1]['id'] == 2
    assert response[1]['text'] == 'Test 2'




if __name__ == '__main__':
  unittest.main()
