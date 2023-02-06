# StationF scraper

Wanna get the data about startup jobs ? 

<img align="left" height="370px" width="700px" alt="memoryGame-image" src="https://github.com/RomainC75/stationF-scraper/raw/master/assets/scraper.png"/>

## Description

Just a little script to put the content of the job offers a mysql database from the station F website. 
I just wanted to use OOP including the models which are written with mysql2. 💪
 
## Getting Started

### Dependencies

* Libraries : puppeteer / puppeteer-cluster / mysql2
* Docker and the mysql container

### Installing

Mysql container:
```
docker run --name stationF_mysql -p 3306:3306 -d -v "${PWD}/mysql/storage":/var/lib/mysql -e MYSQL_ROOT_PASSWORD=<...db_password...> -e MYSQL_DATABASE=stationf mysql
```
```
npm install
```
Don't forget to set the password of the database in a **.env** file :
```
DB_PASS=<db_password>
```


### Executing program

```
node script.js
```

## Help

Any advise for common problems or issues.
```
call me ;-)
```

## Authors

Contributors names and contact info

Romain Chenard
My [linkedIn](https://www.linkedin.com/in/romain-chenard/)

## Version History

* 0.1
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
    * 




