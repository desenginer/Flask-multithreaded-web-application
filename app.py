from flask import Flask, url_for, render_template, request, redirect, jsonify, make_response,json
from flask_sqlalchemy import SQLAlchemy
import threading
import time


def logik(timeS, timeH, timeC):
    global flagH
    global flagC
    timeAl = timeS + timeH + timeC
    time_list.append(timeAl)
    while timeAl > 0:
        if timeAl == (timeH + timeC):
            flagH = 1
            massage = '> Хлебопечь работает на необходимой температуре'
            mass_list.append(massage)
        if timeAl == timeC:
            flagC = 1
            massage = '> Хлебопечь остывает'
            mass_list.append(massage)
        timeAl-= 1
        time.sleep(0.99)
        time_list.append(timeAl)
        print(timeAl)
    return



def save(timeS, timeH, timeC):
    global timeSm
    global timeHot
    global timeChill
    timeSm = timeS
    print(timeSm)
    timeHot = timeH
    print(timeHot)
    timeChill = timeC
    print(timeChill)
    return


# def flask():
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///baker.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
db.app = app


class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sort = db.Column(db.String(20), nullable=False)
    size = db.Column(db.String(2), nullable=False)
    timeSm = db.Column(db.Integer, nullable=False)
    timeHot = db.Column(db.Integer, nullable=False)
    timeChill = db.Column(db.Integer, nullable=False)
    info = db.Column(db.Text, nullable=False)


@app.route('/')
def index():
    return render_template("index.html")


@app.route("/register", methods=("POST", "GET"))
def register():
    if request.method == "POST":
        try:
            u = Program(sort=request.form['sort'], size=request.form['size'], timeSm=request.form['timeSm'],
                        timeHot=request.form['timeHot'], timeChill=request.form['timeChill'], info=request.form['info'])
            db.session.add(u)
            db.session.commit()
        except:
            db.session.rollback()
            print("Ошибка добавления в БД")

        return redirect(url_for('index'))

    return render_template("register.html", title="Регистрация")


@app.route('/', methods=["POST", "GET"])
def create_entry():
    if request.method == "POST":
        start = request.get_json()
        sort = start.get('sort')
        size = start.get('size')
        print(start)
        find = 0

        if sort == 1 and size == 1:
            find = 1
        if sort == 1 and size == 2:
            find = 2
        if sort == 1 and size == 3:
            find = 3
        if sort == 2 and size == 1:
            find = 4
        if sort == 2 and size == 2:
            find = 5
        if sort == 2 and size == 3:
            find = 6
        Prog = Program.query.get(find)
        save(Prog.timeSm, Prog.timeHot, Prog.timeChill)
        time_list.append(Prog.timeSm + Prog.timeHot + Prog.timeChill)
        res = app.response_class(
            response=json.dumps(Prog.info),
            status=200,
            mimetype='application/json'
        )
        return res


@app.route('/uplpad', methods=["GET"])
def logika():
    global countzapr
    countzapr += 1
    if (countzapr == 1):
        if request.method == "GET":
            log = threading.Thread(target=logik, args=(timeSm, timeHot, timeChill), daemon=True)
            log.start()
            result = app.response_class(
                response=json.dumps(time_list[-1]),
                status=200,
                mimetype='application/json'
            )
            return result
    else:
        if request.method == "GET":
            result = app.response_class(
                response=json.dumps(time_list[-1]),
                status=200,
                mimetype='application/json'
            )
            return result


if __name__ == "__main__":
    time_list = [1]
    timeAll = 0
    countzapr = 0
    timeSm = 0
    timeHot = 0
    timeChill = 0
    flagSm = 1
    flagH = 0
    flagC = 0
    mass_list = ['1']
    app.run(debug=True)




