Open /projects/csc648-848-01-su25-T03/application 



### Virtual environments
and input the following in your .gitignor:

    venv/
    env/
    ENV/
    env.bak/
    venv.bak/
    .venv/

save the gitignore, this will keep the python enviornment from getting pushed to our online repo,


then go to:

     ~/projects/csc648-848-01-su25-T03/application/vertical_prototype/backend_project$

assuming you already have installed python run the following command:
    
    python3 -m venv venv

this will install the venv folder,
now activate it with: 

    source venv/bin/activate

at this point you should see a (venv) before your cmd user, like:

    (venv)hamed@PC:~/projects/csc648-848-01-su25-T03/application$

### installing djangorestframework
    pip install django
    pip install djangorestframework

### Mysql

    sudo apt install mysql-client-core-8.0
    sudo apt install mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
 
 configure mysql user pass local databasename 

### running the server locally
    python manage.py makemigrations core
    python manage.py migrate
    python manage.py runserver
