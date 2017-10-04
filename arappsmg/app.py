# coding: utf-8;
# (c) 2017 SMG Team
# This file is part of the:
# ARTC-SMG AR APP 
# The ARTC-SMG SDK is registered software; you cannot redistribute it and/or
# modify without express knowledge of ARTC, parts of this software are
# distributed WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the LGPL License
# for more details.
#
# You should have received a copy of the LGPL License along with this software.
# If not, see <http://www.gnu.org/licenses/old-licenses/lgpl-2.1.en.html>.
#
#
# @Author: Humza Akhtar
# @date: 01/10/2017 Monday, 10:47 PM
# @Copyright: ARTC-SMG SDK
# @License: LGPL
# @Version: 1.0.0
# @Maintainer: akhtarh
# @Email: akhtarh@artc.a-star.edu.sg
# @Status: development


# to do 
# 1. run it on a real phone using github



# import relevant libraries 
from flask import Flask, render_template, flash, redirect, url_for, session, logging, request, json
import os


# create an empty app structure
app = Flask(__name__)



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

	
#setting secret key and running the main app
if __name__ == '__main__':
	app.run()