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
  def test_empty_db(self):
    response = self.app.get('/api')
    assert '[]' in response.data


  def test_create(self):
    todo = {"text": "Testing 1",
            "id": 1}

    response = self.app.post('/api',
                              data=json.dumps(todo),
                              content_type='application/json')

    assert '[]' not in response.data


if __name__ == '__main__':
  unittest.main()
