
Transponder is the service that's responsible for writing device data and events to all of the databases that Api-Server is capable of querying.

## Structure

Transponder is structured as a stateless Reader that employs a sub-set of its possible writers (configured through env variables) to put data in a set of databases in various formats. Each individual writer is stand-alone, and does not rely on any other writer

### Configuration

Transponder is over-all configured with a run-mode that determines the set of writers that it uses. Some examples of different run-modes are historical, real time, firebase, sql, timescale, etc.

Each individual writers configuration is based upon what is needed to connect to the pertinent database. For example, a writer that puts data into MySQL requires the host, port, username, and password of the CloudSQL instance in order to connect to it.

There are certain environment variables that are either shared between all writers, or exist external to the writers themselves namely:

| ENV Variable | description |
| --- | --- |
| CACHE_CONFIG | configuration for connecting to a caching service, see [Cache](http://docs.leverege.com/docs/cache)
| TRANSPORT_CONFIG | configuration for connecting to a message transport system, see [Message Queue](http://docs.leverege.com/docs/message-queue) |
| AUTO_ACK | how to ack incoming messages |
| ACK_ON_ERROR | whether or not to ack messages that fail writing |

### Writers

There is at least one writer for the following message types:

- deviceDataEventMsg
- deviceAckMsg
- deviceEventAckMsg
- outboundInitMsg
- outboundSentMsg

When a message is received by Transponder's processors, it routes every message through all of the configured writers.

#### BigQuery

BigQuery is Google's Data Warehouse/Analytics database. It is designed for querying massive amounts of data. The Leverege Platform currently uses BigQuery for its long-term data storage.

##### Environment

| ENV Variable | description |
| --- | --- |
| DATA_BIGQUERY_SERVICE_ACCOUNT | file location of the service account to access BigQuery |
| DATA_BIGQUERY_PROJECT | name of the Google Project to use when writing to BigQuery |
| BQ_CACHE_TIMEOUT | (optional) variable that controls the writer's table caching |

##### Util

The BigQuery util is a generic writer for all of the possible formats and messages that are ultimately written to BigQuery. It is configured with a schema and template table. This is used to automatically create tables and insert data. This is not a writer in-and-of-itself, but is instead used by the other BigQuery writers 

##### JSON

The BigQueryJson writers write device data and events into BigQuery using the BigQuery util. The basic structure for this data (which varies slightly across tables) is:

| column | description |
| --- | --- |
| id | table primary key |
| time | time of the data |
| deviceId | id of the device data is for |
| systemId | system the device is in |
| blueprintId | type of the device |
| data | data associated with the original message |
| userId | user who create the data or event (if applicable)|

#### Flat (deprecated)

The BigQueryJson writers write device data and events into BigQuery using the BigQuery util. The basic structure for this data is:

| column | description |
| --- | --- |
| time | time of the data |
| path | path into the data this represents |
| value | updated value at that path in the data |

#### CloudSQL

Writes data in both the JSON and flat data formats (described in the BigQuery section) to a MySQL database

##### Environment
| ENV Variable | description |
| --- | --- |
| SQL_MAX_CONNECTIONS | max size of the connection pool for writing |
| SQL_HOST | host of the SQL server |
| SQL_PORT | port of the SQL server |
| SQL_USER | user to authenticate as |
| SQL_PASSWORD | password to authenticate with |
| SQL_KEEP_TIME | used to throw out stale messages with old timestamps upon arrival |
| SQL_CA | used when the SQL server requires ssl connections |
| SQL_CLIENT_CERT | used when the SQL server requires ssl connections |
| SQL_CLIENT_KEY | used when the SQL server requires ssl connections |
| SQL_CACHE_TIMEOUT | (optional) used to control the writer's table caching |


#### Firebase

Writes data into Firebase in several formats.

##### Environment
| ENV Variable | description |
| --- | --- |
| DATA_FIREBASE_CONFIG | location of the firebase config file to authenticate with |
| DATA_FIREBASE_SERVICE_ACCOUNT | location of the firebase service account to authenticate with |
| FB_CACHE_TIMEOUT | (optional) unused by firebase |

##### events

Writes events into Firebase using the JSON format (described in the BigQuery section)

##### Outbound messaging

Writes outbound messages and their current state using:

- outboundInitMsg
- outboundSentMsg
- deviceAckMsg

This handles the entire outbound messaging system

##### RT

Writes the data portion of the deviceDataEventMsg to firebase. Each data array is treated as a path to update the overall realtime state of the device.

#### TimescaleDB

Writes data in the JSON data format (described in the BigQuery section) to a TimescaleDB database

##### Environment

| ENV Variable | description |
| --- | --- |
| PG_POOL_CONNECTION_LIMIT | max size of the connection pool for writing |
| PG_PORT | port of the postgres server |
| PG_HOST | host of the postgres server |
| PG_USER | postgres username |
| PG_PASSWORD | postgres password |
| PG_DATABASE | postgres database to connect to |
| TDB_CACHE_TIMEOUT | (optional) used to control the writer's table caching |
