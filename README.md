
# Birca 

This is an images sharing web app built in JavaScript. It was a project on 
Blekinge Institute of Technology 2014/2015 in the course DV1483


## Some info about the technology 

When I implemented Birca I wanted to explore new technologies, and that I did.
Both on the server-side and on the client-side built in JavaScript. NodeJS powers 
the service-side with Expressjs as framework. And the client-side is built in
nativ js and  jQuery. This is the first app that I have built in Expressjs so 
please comment the code if I have done some huge mistake or do a pull-request 
with better code. 

## Installing the app on your server

This guide explains how to install Birca on your Debian 7 server.

### Dependencies

Before you start this guide, make sure that you have this installed
* [Node.js](http://nodejs.org/)
* [NPM](http://nodejs.org/)
* [MySQL](http://www.mysql.com/)
* [Git](http://git-scm.com/)

#### Step one

Download Birca from Github.com.

```
$ git clone git@github.com:foikila/DV1483-Project.git Birca
```

#### Step two

Create the directory for all new images uploads.

```
$ mkdir Birca/api/public/uploads
```

#### Step three

Change directory and install the dependencies. 

```
$ cd Birca/api/ && npm install
```

#### Step four

Setting up the database. Default is mysql and that is what I use, but you can easily 
change it to these databases.
* MySQL
* MariaDB
* SQLite
* PostgeSQ

Changes the settings for **your** [DSN](http://en.wikipedia.org/wiki/Data_source_name)
i.e Host, Username and Password.

```
$ vim config/config.json
```

Read more about the [ORM](http://en.wikipedia.org/wiki/Object-relational_mapping) i use [here](sequelizejs.com).
 
#### Step five

Start the server. 

```
$ npm start
```

If you got any errors when running *start* command, please check npm-debug log to find out what the error is. 
if you can't figure out the error yourself, please post an issue and I can help you.

#### Step six
Enjoy Birca at port 8019! 

To change the port edit the www-file.
```
$ vim bin/www
```

If you planning on running Birca forever please check out this
[guide](https://www.digitalocean.com/community/tutorials/how-to-host-multiple-node-js-applications-on-a-single-vps-with-nginx-forever-and-crontab).


## History

v0.0.2 (2015-01-15)
* Correct minor mistakes in README.md
* Removed console logs that wasn't useful 
* Minor changes in index.html

v0.0.1 (2015-01-24)
* First alpha release

## License 

This web app is carried under [The MIT License (MIT)](LICENSE)

Copyright (c) 2015 Jonatan Karlsson
