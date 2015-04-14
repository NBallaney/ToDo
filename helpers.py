import json


def check_status_code(response, expected_code, error_code):
  if response.status_code != expected_code:
    assert response.status_code == error_code
  

def create_todo(self, id, text):
  todo = {'text': text,
          'id': id}

  response = self.app.post('/api',
                            data=json.dumps(todo),
                            content_type='application/json')
  return check_status_code(response, 201, 400)


def retrieve_todos(self):
  response = self.app.get('/api')
  check_status_code(response, 200, 404)
  json_response = json.loads(response.data)
  return json_response


def update_todo(self, id, text):
  payload = {'text' : text}
  response = self.app.put('/api/%d' % (id),
                           data=json.dumps(payload),
                           content_type='application/json')
  return check_status_code(response, 204, 405)
