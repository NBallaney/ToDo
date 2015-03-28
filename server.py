import sqlite3
from flask import Flask, g, request, render_template, redirect, json, Response

# app = Flask(__name__)
app = Flask(__name__, static_url_path='', static_folder='')
# app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

# @app.route('/tasks.json', methods=['GET', 'POST'])
# def tasks_handler():

#     with open('tasks.json', 'r') as file:
#         tasks = json.loads(file.read())

#     if request.method == 'POST':
#         tasks.append(request.form.to_dict())

#         with open('tasks.json', 'w') as file:
#             file.write(json.dumps(tasks, indent=4, separators=(',', ': ')))


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
  data = g.db.execute("SELECT todo FROM todos").fetchall()
  todos = []
  for i in data:
    todos.append(i[0])
  return json.dumps(todos)

@app.route('/', methods = ['POST'])
def post_todo():
    incomingDict = request.form.to_dict()
    todo = incomingDict.keys()[0]

    g.db.execute("INSERT INTO todos VALUES (?)", [todo])
    g.db.commit()
    return redirect('/getTodos')

if __name__ == '__main__':
    app.debug = True
    app.run(port=3000)
