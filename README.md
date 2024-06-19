# init database with docker

```
docker volume create hansolo_data 
docker run -d -p 3306:3306 --name hansolo_mysql -e MYSQL_ROOT_PASSWORD=root -v hansolo_data:/var/lib/mysql mysql:8.0.31

# create database
create database hanSoloDB
```