DB-Curator is the service that is responsible for deleting old or stale data from databases after a specified period of time.

## Structure

DB-Curator is structured as a set of long-running loops that run once per day at a specified time. The processes that clean up individual databases are independent, and run in parallel with each other.

## Configuration

DB-Curator is overall configured with a small set of environment variables that determine which cleanup scripts run. By making the value of these variables false, one can turn off selected cleanup scripts.

| ENV Variable | Description |
| --- | --- |
| SQL_CLEANUP_ENABLED | whether or not the MySQL cleanup script is enabled |
| FB_CLEANUP_ENABLED | whether or not the firebase cleanup script is enabled |
| PG_CLEANUP_ENABLED | whether or not the PostgreSQL cleanup script is enabled |

Additionally, certain env variables are shared between clean up scripts. The most important of these is 'SQL_KEEP_PERIOD' which tells both the MySql and Postgres scripts how long to go back before deleting data.

### Firebase Configuration

| ENV Variable | Description |
| --- | --- |
| FIREBASE_CLEANUP_CONFIG | a JSON string specifying what paths in firebase to clean up, and how long to keep data |

An example of the Firebase cleanup config is:

```json
[
  {
    "listPath" : "rt/*/dev/*/geolog",
    "keepTime" : 604800000,
    "itemTimePath" : "time"
  },
  {
    "listPath" : "rt/*/dev/*/events/*",
    "keepTime" : 604800000,
    "itemTimePath" : "time"
  }
]
```

The config specifies locations (as an array) in firebase of time ordered lists to be cleaned up using the following three keys:

| Key | Description |
| --- | --- |
| listPath | path in firebase (including *'s) to the list or set of lists to be cleaned up |
| keepTime | length of time to keep data before it is deleted (ms) |
| itemTimePath | since each list or set of lists should be comprised of similar objects, this specifies the time key of each item that can be used to determine the age of the object |

### Postgres Configuration

| ENV Variable | Description |
| --- | --- |
| PG_POOL_CONNECTION_LIMIT | max number of connections to make to postgres |
| PG_HOST | host the database is located at |
| PG_PORT | port the database is located at |
| PG_USER | postgres user name |
| PG_PASSWORD | postgres password |
| PG_DATABASE | database to connect to |

### MySQL Configuration

| ENV Variable | Description |
| --- | --- |
| SQL_CONNECTION_LIMIT | maximum connections to make to the sql server |
| SQL_HOST | host the db is located at |
| SQL_PORT | port the db is located at |
| SQL_USER | username to login with |
| SQL_PASSWORD | password to login with |
| SQL_CA | server's CA if it has ssl enabled |
| SQL_CLIENT_CERT | client's cert if the server has ssl enabled |
| SQL_CLIENT_KEY | client's key if the server has ssl enabled |