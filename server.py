import sqlite3
import os
from flask import Flask, g, request, render_template, json
from contextlib import closing


app = Flask(__name__, static_url_path='', static_folder='')
app.config['DATABASE'] = os.path.join(app.root_path, 'todos.db')


def connect_db():
  rv = sqlite3.connect(app.config['DATABASE'])
  rv.row_factory = sqlite3.Row
  return rv


def get_db():
  if not hasattr(g, 'db'):
      g.db = connect_db()
  return g.db


def init_db():
  db = get_db()
  with closing(connect_db()) as db:
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()


# Teardown request is always executed after every request
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
  db = get_db()
  data = db.execute("SELECT text,id FROM todos").fetchall()
  todos = []
  for i in data:
    todos.append({'text': i[0], 'id': i[1]})
  return json.dumps(todos)


@app.route('/api', methods = ['POST'])
def post_todo():
  jsonData = request.get_json()
  text = jsonData['text']
  id = jsonData['id']
  db = get_db()
  db.execute("INSERT INTO todos (id, text) VALUES (?, ?)", [id, text])
  db.commit()
  return 'ToDo Created'


@app.route('/api/<id>', methods = ['DELETE'])
def delete_todo(id):
  db = get_db()
  db.execute("DELETE FROM todos WHERE id=(?)", [id])
  db.commit()
  return 'ToDo Completed'


@app.route('/api/<id>', methods = ['PUT'])
def update_todo(id):
  text = request.get_json()['text']
  db = get_db()
  db.execute("UPDATE todos SET text=(?) WHERE id=(?)", [text, id])
  db.commit()
  return 'ToDo Updated'


if __name__ == '__main__':
    # app.debug = True
    app.run(port=3000)
