# Geotile API
Generates geotiles for images.

## Usage
See [API Docs](https://documenter.getpostman.com/view/11532378/SztBa7Xn?version=latest)

## TODO:
1. Extend dockreate script to enabled support for python3 and packages. Until then, run these commands by execing into the instance w/k8x:
```
ln -s /usr/bin/python3 /usr/bin/python && pip3 install --global-option=build_ext --global-option="-I/usr/include/gdal" GDAL==`gdal-config --version`
```
2. Route the api-server w/authz

## Install (Local)
1. Install Conda: `brew cask install conda`
2. Setup python3 environment: `conda create --name py3 python=3.7`
3. Use python3 environment: `conda activate py3`
4. Install GDAL w/Conda: `conda install gdal`
5. Install node modules: `npm install`
6. Setup sql database: `mysql -u root -p # pwd: root` + `create database geotile_server; quit;`
7. Run tests: `npm test`

## Run w/Local (MySQL) Database
1. Uncomment option in `.env`
2. Start server: `npm start`

## Run w/Dev (GCP Postgres) Database
1. Uncomment option in `.env`
2. Start port forwaring in seperate tab: `npm run postgres-port-forward`
3. Start server: `npm start`

## Troubleshooting
1. SequelizeConnectionRefusedError (connect ECONNREFUSED 127.0.0.1:3306): ```mysql.server start```
2. ImportError (libgdal.20.dylib): ```python --version && which python```
