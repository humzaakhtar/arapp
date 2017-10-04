"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template
from FlaskWebProject import app

@app.route('/')
@app.route('/home')
def index():
    """Renders the home page."""
    return render_template(
        'home.html'
    )


# about page route function
@app.route('/about')
def about():
	return render_template('about.html')

#dashboarding page for showing dashboard
@app.route('/dashboard')
def dashboard():
	return render_template('dashboard.html')
