from flask import Blueprint, render_template

view_bp = Blueprint('view', __name__)

@view_bp.route('/')
def index():
    return render_template('index.html')

@view_bp.route('/scenario1')
def scenario1():
    return render_template('scenario1/home.html')

@view_bp.route('/scenario1_lesson1')
def scenario1_lesson1():
    return render_template('scenario1/lesson1.html')

@view_bp.route('/scenario1_lesson2')
def scenario1_lesson2():
    return render_template('scenario1/lesson2.html')

@view_bp.route('/scenario1_lesson3')
def scenario1_lesson3():
    return render_template('scenario1/lesson3.html')

@view_bp.route('/scenario2')
def scenario2():
    return render_template('scenario2/home.html')

@view_bp.route('/scenario2_lesson1')
def scenario2_lesson1():
    return render_template('scenario2/lesson1.html')

@view_bp.route('/scenario2_lesson2')
def scenario2_lesson2():
    return render_template('scenario2/lesson2.html')

@view_bp.route('/scenario2_lesson3')
def scenario2_lesson3():
    return render_template('scenario2/lesson3.html')

@view_bp.route('/scenario3')
def scenario3():
    return render_template('scenario3/home.html')

@view_bp.route('/scenario3_lesson1')
def scenario3_lesson1():
    return render_template('scenario3/lesson1.html')

@view_bp.route('/scenario3_lesson2')
def scenario3_lesson2():
    return render_template('scenario3/lesson2.html')

@view_bp.route('/scenario3_lesson3')
def scenario3_lesson3():
    return render_template('scenario3/lesson3.html')