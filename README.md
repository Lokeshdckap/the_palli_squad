FrontEnd env file  Details ->  REACT_APP_SECRET_KEY="akash@123"
Backend env file details - >
PORT = 5000
username =  "dckap",
password = "admin",
database= "secret_manager",
host = "localhost",
dialect = "postgres",
secretKey = 'lokesh123'
HOST = 'localhost'
USER = dckapjournal@gmail.com
PASS =  okrcsfogyorqnjqo
SERVICE = smtp.gmail.com
FRONTEND_BASE_URL = "http://localhost:3000/"
BASE_URL = "http://localhost:5000/"
Database Tables
users,
teams
invites
unauthor device login
secrets
team_secrets
share_secrets_to_users
share_secrets_to_teams
user_team_members
role_type
secret_code
email_verification
otp_verification
Database Migration comments
npx sequelize-cli db:migrate
Login Crenditals for only superadmin
Email:pallisquad@gmail.com
Password: "Test@123"
How To run Backend
1.First Take git pull  and go to backend folder
2. setup .env file
3. run the command like npm i or npm install
4. npx sequelize-cli db:migrate,
5. run the  npm run dev or nodemmon  see your local file will be running
How To run Frontend 
1.First Take git pull  and go to frontend folder
2. setup .env file
3. run the command like npm i or npm install
4. run the  npm start  see your local file will be running
Note : You want run local backend config  folder must in the backend file
config.json file
{
  "development": {
    "username": "dckap",
    "password": "admin",
    "database": "secret_manager",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "yourUserName",
    "password": "yourPassword",
    "database": "aratta_express_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "yourUserName",
    "password": "yourPassword",
    "database": "aratta_express_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
corsOptions.js
const whiteList = ['http://localhost:3000/','http://127.0.0.1:3001/']
const corsOptions = {
    origin:(origin,callback)=>{
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error ('Not Allowed By Cors'))
        }
    },
    optionsSucessStatus : 200
}
