from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/scenario1')
def scenario1():
    return render_template('scenario1/home.html')

@app.route('/scenario1_lesson1')
def scenario1_lesson1():
    return render_template('scenario1/lesson1.html')

@app.route('/scenario1_lesson2')
def scenario1_lesson2():
    return render_template('scenario1/lesson2.html')

@app.route('/scenario1_lesson3')
def scenario1_lesson3():
    return render_template('scenario1/lesson3.html')



@app.route('/scenario2')
def scenario2():
    return render_template('scenario2/home.html')

@app.route('/scenario2_lesson1')
def scenario2_lesson1():
    return render_template('scenario2/lesson1.html')

@app.route('/scenario2_lesson2')
def scenario2_lesson2():
    return render_template('scenario2/lesson2.html')

@app.route('/scenario2_lesson3')
def scenario2_lesson3():
    return render_template('scenario2/lesson3.html')

@app.route('/scenario3')
def scenario3():
    return render_template('scenario3/home.html')

@app.route('/scenario3_lesson1')
def scenario3_lesson1():
    return render_template('scenario3/lesson1.html')

@app.route('/scenario3_lesson2')
def scenario3_lesson2():
    return render_template('scenario3/lesson2.html')

@app.route('/scenario3_lesson3')
def scenario3_lesson3():
    return render_template('scenario3/lesson3.html')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
