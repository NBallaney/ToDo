import sqlite3
from flask import Flask, g, request, render_template, json

app = Flask(__name__, static_url_path='', static_folder='')

@app.before_request
def before_request():
  g.db = sqlite3.connect("todos.db")
  g.db.row_factory = sqlite3.Row

@app.teardown_request
def teardown_request(exception):
  if hasattr(g, 'db'):
    g.db.close()

@app.route('/')
def returnIndexPage():
  return render_template('index.html')

@app.route('/getTodos')
def get_todos():
  data = g.db.execute("SELECT text,id FROM todos").fetchall()
  todos = []
  for i in data:
    todos.append({'text': i[0], 'id': i[1]})
  return json.dumps(todos)

@app.route('/', methods = ['POST'])
def post_todo():
  jsonData = request.get_json()
  text = jsonData['text']
  id = jsonData['id']
  g.db.execute("INSERT INTO todos (id, text) VALUES (?, ?)", [id, text])
  g.db.commit()
  return 'Successful POST'

@app.route('/<id>', methods = ['DELETE'])
def delete_todo(id):
  g.db.execute("DELETE FROM todos WHERE id=(?)", [id])
  g.db.commit()
  return 'Successful DELETE'

if __name__ == '__main__':
    # app.debug = True
    app.run(port=3000)
