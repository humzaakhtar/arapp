"""
Routes and views for the flask application.
"""

from flask import render_template
from arappsmg import app



# home page route function
@app.route('/')
def index():
	return render_template('home.html')

# about page route function
@app.route('/about')
def about():
	return render_template('about.html')

#dashboarding page for showing dashboard
@app.route('/dashboard')
def dashboard():
	return render_template('dashboard.html')
