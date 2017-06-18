# 4sights.news SEBA Master Web Application

Main components
- Angular 4
- Angular-Material 2
- Angular CLI (Typescript, ...)
- express
- mongoose (MongoDB Client)
- Authentication with JWT

Reference Point
- angular2-full-stack boilerplate

### Install
_Note:_  
We have tested this application with node versions ranging from legacy versions, lts (v6.11.x) to latest (v8.1.2).
However please consider using the latest version of `node` (`>=8.1.0`) and `npm` (`>=5.0.0`).  
`npm` versions before `5.0.0` ignore the lock file which could lead to unexpected dependency trees.
``` bash
$ npm install
```

### Run Development Server with Hot Reloading (Starts DB, server, client)
_Note:_ Please be sure to have `mongod` installed on your system. `mongod`'s directory also has to the path environment variable!
``` bash
$ npm run dev
```

### Seed Database with predefined data
Example `users`, `categories` and `topics` have been added for your convenience.
In order to pre-populate your database, simply execute:  
``` bash
$ npm run db:seed
```
_Note:_ Please be sure to have `mongod` running on your system. Either execute `npm run dev` or `mongod` before you try to run the seed command.  

__Admin account:__  
Login: `christopher.lass@tum.de`  
Password: `123456`

__Normal user account:__  
Login: `john.doe@gmail.com`   
Password: `123456`


### Run for production
``` bash
$ npm run prod
```
