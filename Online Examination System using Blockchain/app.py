from flask import Flask, render_template, redirect, url_for, session, flash, request
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, ValidationError
import bcrypt
from email_validator import validate_email, EmailNotValidError
from flask_mysqldb import MySQL
from web3 import Web3

app = Flask(__name__, static_folder='static')
app._static_folder='static'

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'users'
app.secret_key = 'xyzabc'

mysql = MySQL(app)

class RegisterForm(FlaskForm):
    name = StringField("Name",validators=[DataRequired()])
    email = StringField("Email",validators=[DataRequired(), Email()])
    password = PasswordField("Password",validators=[DataRequired()])
    submit = SubmitField("Register")

class LoginForm(FlaskForm):
    email = StringField("Email",validators=[DataRequired(), Email()])
    password = PasswordField("Password",validators=[DataRequired()])
    submit = SubmitField("Login")


@app.route('/')
def index():
    
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        password = form.password.data

        hashed_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())

        # store data into database 
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO register (name,email,password) VALUES (%s,%s,%s)",(name,email,hashed_password))
        mysql.connection.commit()
        cursor.close()

        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM register WHERE email=%s",(email,))
        user = cursor.fetchone()
        cursor.close()
        if user and bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            session['user_id'] = user[0]
            return redirect(url_for('exam'))
        else:
            flash("Login failed. Please check your email and password")
            return redirect(url_for('login'))
    
    return render_template('login.html', form=form)


@app.route('/exam')
def exam():
    if 'user_id' in session:
        user_id = session['user_id']

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM register where id=%s",(user_id,))
        user = cursor.fetchone()
        cursor.close()

        if user:
            return render_template('exam.html',user=user)
            
    return redirect(url_for('login'))

@app.route('/show_score')
def show_score():
    # Retrieve the score from the URL parameter
    score = request.args.get('score')
    return render_template('score.html', score=score)

if __name__ =='__main__':
    app.run(debug=True)