
Scheduler is a service that schedules timers to perform actions at a later time or in a repeating fashion. It is important to use scheduler over built in methods like `setTimeout` and `setInterval` for efficiency. Scheduler operates by saving timers to a SQL database. This database is checked at an interval specified in the config. During this check, all the timers that have reached their expiration have their functionality executed. 

Timers can be created, deleted and modified in three ways. The first way is manually through the Leverege UI, under the timers section. The second way is to start a timer message in the Leverege Platform. There are several of these messages and they can be found in detail in the [Messages](http://docs.leverege.com/docs/messages) library. The last way to interact with Timers is through the api routes exposed by scheduler.

Timers have two main attributes, the first attribute is focused on when the timers will run. Timers can be set to occur once, at a set interval or on a cron schedule. The second attribute determines what action will be taken. Actions can be to publish a message to a topic, trigger a script or query a url.

## Configuration

All configuration options for scheduler have defaults set, but important information to set up a SQL connection is included that will almost always require reconfiguring.

#### Optional

| Name | Description | Default |
| ---- | ----------- | ------- |
| TRANSPORT_CONFIG | config for readers and writers | `{ type, host, port }` |
| NSQ_HOST_ADDR | host address for NSQ, if TRANSPORT_CONFIG is not specified | `'127.0.0.1'` |
| NSQ_HOST_PORT | port for NSQ, if TRANSPORT_CONFIG is not specified | `4150` |
| SCHEDULER_TOPIC | topic that scheduler will listen to for incoming messages | `'scheduler'` | 
| PORT | port that scheduler will listen to | `9937` |
| CORS_ORIGIN | acceptable CORS origin | `'*'` |
| POLL_EVERY | time interval in ms that scheduler will check all timers | `2000` |
| SCHEDULER_LOOK_AHEAD | ms that will be added to check if timers have passed | `250` |
| SCHEDULER_BATCH_SIZE | size of the batches that will be processed | `1000` |
| RESCHEDULER_BATCH_SIZE | size of batches when timers are rescheduled | `100` |
| SQL_HOST | SQL host | `'localhost'` |
| SQL_PORT | SQL port | `3306` |
| SQL_USER | SQL user | `'root'` |
| SQL_PASSWORD | SQL password | `'root'` |
| SQL_DATABASE | SQL database | `'scheduler'` |
| SQL_TABLE | SQL table | `'scheduler'` |
| SQL_DIALECT | SQL dialect | `'sqlite'` |
| SQL_DIALECT_OPTIONS | SQL dialect options | `undefined` |
| SQL_STORAGE | SQL storage | `'./database.sqlite3'` |
| SQL_TIMEZONE | SQL timezone | `'+00:00'` |
| SQL_POOL_CONNECTION_LIMIT | SQL pool connection limit | `10` |
| SQL_POOL_MAX_CONNECTION | SQL pool max connections | `10` |
| SQL_POOL_MIN_CONNECTION | SQL pool min connections | `1` |
| SQL_POOL_ACQUIRE | SQL pool acquire | `30000` |
| SQL_POOL_IDLE | SQL pool idle | `10000` |
| SQL_CA | SQL ssl ca | `undefined` |
| SQL_CLIENT_CERT | SQL ssl cert | `undefined` |
| SQL_CLIENT_KEY | SQL ssl key | `undefined` |
