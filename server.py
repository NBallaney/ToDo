import sqlite3
from flask import Flask, g, request, render_template, json

app = Flask(__name__, static_url_path='', static_folder='')


@app.before_request
def before_request():
  g.db = sqlite3.connect("todos.db")


# Teardown request is always executed, even if before_request fails.
@app.teardown_request
def teardown_request(exception):
  if hasattr(g, 'db'):
    g.db.close()


@app.route('/')
def returnIndexPage():
  return render_template('index.html')


@app.route('/api')
def get_todos():
  # Returns a list of tuples.
  data = g.db.execute("SELECT text,id FROM todos").fetchall()
  todos = []
  for i in data:
    todos.append({'text': i[0], 'id': i[1]})
  return json.dumps(todos)


@app.route('/api', methods = ['POST'])
def post_todo():
  jsonData = request.get_json()
  text = jsonData['text']
  id = jsonData['id']
  g.db.execute("INSERT INTO todos (id, text) VALUES (?, ?)", [id, text])
  g.db.commit()
  return 'ToDo Created'


@app.route('/api/<id>', methods = ['DELETE'])
def delete_todo(id):
  g.db.execute("DELETE FROM todos WHERE id=(?)", [id])
  g.db.commit()
  return 'ToDo Completed'


@app.route('/api/<id>', methods = ['PUT'])
def update_todo(id):
  text = request.get_json()['text']
  g.db.execute("UPDATE todos SET text=(?) WHERE id=(?)", [text, id])
  g.db.commit()
  return 'ToDo Updated'


if __name__ == '__main__':
    # app.debug = True
    app.run(port=3000)
