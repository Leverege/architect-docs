---
id: history
title: History
---
The history interface allows a user to make complex queries against the historical and event data stored by the system against devices, systems, and projects.

## Api Endpoints

Using the @leverege/api npm package, there are several available functions that will allow for fetching history and event data. They are:

```
// For device level history/events
api.device( 'deviceId' ).history( opts )
api.device( 'deviceId' ).events( opts )
// For system level history/events
api.system( 'systemId' ).device.history( opts )
api.system( 'systemId' ).device.events( opts )
// For project level history/events
api.project( 'projectId' ).device.history( opts )
api.project( 'projectId' ).device.events( opts )
```
## Query Format


### Overall Format

| Option | Description | required | default |
| ------ | ----------- | -------- | ------- |
| start | the time to start getting data | true | n/a |
| end | the time to stop getting data | false | now |
| paths | the list of attributes/data paths to get: [details](#paths) | false | all data |
| where | the list of logical comparisons to filter returned rows: [details](#where) | false | null |
| group | the set of data to group by: [details](#grouping) | false | null |
| order | the set of data to order by: [details](#ordering) | false | null |

### Paths Format <a name="paths"></a>

Paths are formatted as an array of either arrays or strings where each sub-array/string represents a path to get from the data

#### string paths

string paths are the simplest way of referencing data in each row. Paths can reference one of two things, either a root column or a deep path into a JSON data object.

##### examples

given a row:

| id | time | data | userId |
| --- | --- | --- | --- |
| test-id | 2019-02-20T15:52:00.525Z | `{ "foo" : { "bar" : "baz" } }` | test-user |

the following paths return the following data:

- $id - the id column
- $time - the time column
- $data - the data column
- foo/bar - the deep foo/bar path in the data column, in this case "baz"
- $data/foo - the deep foo path in the data column, returned as a string

given a more complex schema, such as the events, which have both an "event" model and and an "ack" model:

##### event

| id | time | type | data | userId |
| --- | --- | --- | --- | --- |
| test-id | 2019-02-20T15:52:00.525Z | default | `{ "foo" : { "bar" : "baz" } }` | test-user |

##### ack

| id | time | data | userId |
| --- | --- | --- | --- |
| test-id | 2019-02-20T16:14:01.483Z | `{ "ackedBy" : "James" }` | test-user |

the paths default to referencing the "event" model, so in order to reference the "ack" model, special syntax must be used:

- `$ack.time` - the time the event was acknowledged
- `$event.time` - the time of the event
- `$time` - the time of the event (same as `$event.time`)
- `$ack.data/ackedBy` - the ackedBy field in the data column of the ack model, "James" in this instance
- `$event.data/foo/bar` - "baz"

#### array paths

Array paths work much like string paths, but in an extended format. The basic format of an array path is:

```json
[
  "accessor string",
  "alias",
  {
    function : "function name",
    args : [ "@COLUMN()" ]
  },
  "cast type"
]
```

| Index | Description | required | default |
| ------ | ----------- | -------- | ------- |
| 0 | the accessor string as mentioned above | true | n/a |
| 1 | the alias (the key in the returned object) | false | the last key in the path |
| 2 | a function descriptor object (see [here](#functions)) | false | null |
| 3 | a type to cast the result to (see [here](#casting)) | false | null |

##### examples

The array path:

`[ "$time", "hourTime", { "function" : "BUCKET_TIME", "args" : [ 3600000 ] } ]`

Will get the time for each row, aggregate it based on a bucket of time it falls into, and return it in the field "hourTime". The width of each bucket in this instance is one hour, so all data points from the same hour would be bucketed into a single final data point. This is a good way to get averages or other metrics across other fields through time.

#### function descriptors

In order to run calculations on data in rows, or aggregregate data across rows, you have to use function descriptors. The format of function descriptors is an object as follows:

| Option | Description | required | default |
| ------ | ----------- | -------- | ------- |
| function | the function to perform | true | n/a |
| args | the arguments to pass into the function | false | [ "@COLUMN()"] |
| type | the type to cast the input COLUMN to (see [here](#casting)) | false | null |

> TODO : type is not specific enough for multi-argument functions

##### examples

`{ "function" : "+", "arguments" : [ "@COLUMN()", 1 ] }`

This function takes the existing referenced column and adds 1 to each value

`{ "function" : "AVG", "type" : "float" }`

This function takes the referenced column, casts it as a column of floats, and averages it. Aggregating functions typically require some form of [grouping](#grouping) to be useful.

> *** Despite the work to make all backend db's seem identical, there are occasionally subtle differences in the db's that may require different casting or different function names depending on which database is being referenced. ***

### Where <a name="where"></a>

The where clause is used to filter the returned rows in your dataset. the general syntax is:

`[ <path specifier>, <operator>, <value or different path specifier***> ]`


in this, a column identifier looks identical to a path from the previous section

\*** in the second part of a comparison the path specifier must be wrapped as such: `{ type : 'field', value : <path specifier> }`. This is to accomadate the fact that an array here might relate to an "IN" operator, and must then be differentiated

#### examples

##### simple

The following will return rows where the number of gps satellites is greater than 9.

```js
[ 'vessel/location/numSatellites', '>', 9 ]
```

##### IN

The IN clause makes things a bit more complex, and requires use of an array. The following will return any rows where the deviceId is in the set of 'val1' and 'val2'.

[ '$deviceId', 'IN', [ 'val1', 'val2' ] ]

##### complex
The following will filter for where the time of a row in msTime is greater than the msTime of the previous row + 50 ms. This will ultimately only return rows where the gaps between rows is greater than 50 milliseconds.
```js
[
  '$time', null, { function : 'UNIX_MILLIS' } ],
  '>',
  { type : 'field', value : [ '$lagTime', null, { function : '+', args : [ { function : 'UNIX_MILLIS' }, 50 ] } ] }
]
```

### Casting <a name="casting"></a>

The type is the last optional entry in a path array, or the specified value in a function descriptor. Supported types right now are:

- boolean
- integer
- float
- string
- time
- msTime
- object

the two special types are msTime and object. msTime will ensure that a date field is returned in ms since the epoch format, and object will ensure that an object is returned as such instead of as a JSON string.

### Grouping <a name="grouping"></a>

Grouping is the option that is responsible for ensuring that aggregate functions occur over sets of data where a specific value is the same.

A great example of this is bucket time. Take the following path array:

`[ "$time", "bTime", { "function" : "BUCKET_TIME", "args" : [ 900000 ] } ]`

All BUCKET_TIME does on its own is essentially truncate a timestamp to a certain level of accuracy. In the example above, each timestamp is essentially floored to its last 15 minute value. So with two rows like:

| id | time | data | userId |
| --- | --- | --- | --- |
| test-id | 2019-02-20T16:14:01.483Z | `{ "foo" : 5 }` | test-user |
| test-id-2 | 2019-02-20T16:03:01.420Z | `{ "foo" : 15 }` | test-user |

they will both be turned into

| id | bTime | data | userId |
| --- | --- | --- | --- |
| test-id | 2019-02-20T16:00:00.000Z | `{ "foo" : 5 }` | test-user |
| test-id-2 | 2019-02-20T16:00:00.000Z | `{ "foo" : 15 }` | test-user |

Note that in the returned data the time is the same, but two rows were returned.

Now imagine that your group options look like:

`[ "bTime" ]`

and your full paths array looked like:

```json
[
  [ "$time", "bTime", { "function" : "BUCKET_TIME", "args" : [ 900000 ] } ],
  [ "foo", "aFoo",  ], { "function" : "AVG" }  ]
]
```

the returned rows would now be:

| bTime | aFoo |
| --- | --- |
| 2019-02-20T16:00:00.000Z | 10 |

where the time is bucketed and the result of aFoo is the average of the foo value for the two rows

### Ordering <a name="ordering"></a>

Because the nature of our data is almost exclusively time-series, it is likely you will want to order by time in some fashion. In order to do so one must add an array at the __order__ key in the query.

Each entry of this array will be either a string referencing an alias or root column, or an array where the first element is the alias or root column, and the second element is the direction of ordering, 'ASC' or 'DESC'.

#### examples

To sort by time in ascending order

```json
[
  "$time"
]
```

To sort by time in descending order

```json
[
  [ "$time", "DESC" ]
]
```

To sort by a calculated field in descending order

```json
[
  [ "myFancyAlias", "DESC" ]
]
```

## Window Functions

all window functions share similar structure in querying. They look much like other functions but have a couple extra fields.

### structure

| Option | Description | required | default |
| ------ | ----------- | -------- | ------- |
| function | the function to perform | true | n/a |
| args | the arguments to pass into the function | false | [ "@COLUMN()"] |
| type | the type to cast the input COLUMN to (see [here](#casting)) | false | null |
| isWindow | is the function a window function (must be true) | true | null |
| order | what to order the window by | false | null |
| partition | what field to split the window into sections by | false | null |


### example

```json
{ function : 'LAG', isWindow : true, order : '$time', partition : '$deviceId' }
```

As you can see in addition to normal function fields, window functions also have fields for isWindow, which must be set to true, order, to set the window order, and partition, to filter the resultant rows to relevant items. Partition is especially useful when you are querying against a set of devices and only want the window function to see rows from the same device.

## Convenience Functions <a name="convenience"></a>

In order to further unify the experience between the different databases, certain functions and argument sets were mapped from each database and exposed

### BUCKET_TIME

This function allows for grouping and aggregation of data into windows of time.

#### arguments
| name | description | required | default value |
| --- | --- | --- | --- |
| windowSize | the size of each window of data in ms | false | 900000 (15 minutes) |
| column | the column to call the function on | false | @COLUMN() (the column from earlier in the attribute)

### DATE_FORMAT

Date Format allows for dates and times to be returned as formatted strings

#### arguments

| name | description | required | default value |
| --- | --- | --- | --- |
| date | the date column to use ( usually @COLUMN() ) | true | n/a |
| format | the format to use when converting the time | true | n/a |

#### format specification

the format string uses string escapes to figure out how to convert the time into a string

| name | description |
| --- | --- |
| YEAR | |
| MONTH | |
| DAY | |
| HOUR | |
| MINUTE | |
| SECOND | |
| SECOND_PART | the second with its partial second e.g. 45.145 s |

__Examples:__

`@YEAR()-@MONTH()-@DAY()T@HOUR():@MINUTE():@SECOND_PART()Z`

returns

`2019-02-27T21:19:14.153Z`

### STR_TO_DATE

The same as DATE_FORMAT but instead reads a string field into a date.

#### arguments

| name | description | required | default value |
| --- | --- | --- | --- |
| string | the string column to use ( usually @COLUMN() ) | true | n/a |
| format | the format to use when converting the time | true | n/a |


### UNIX_MILLIS

Turns any date field into its ms since epoch format.

#### arguments

| name | description | required | default value |
| --- | --- | --- | --- |
| date | the date column to use ( usually @COLUMN() ) | true | n/a |

### Arithmetic Operators

Because arithmetic requires expressions, arithmetic operators have been added in the form of functions. The functions can be referenced as `+`, `-`, `*`, and `/`. Inside, the arguments will all be combined using the operator specified

#### examples

function:

```json
{ function : "*", args : [ 2, 3 ] }
```
result:

__6__

function:
```json
{
  function : "+",
  args : [
    2,
    { function : "/", args : [ 8, 2 ] },
    { function : "*", args : [ 3, 20 ] }
  ]
}
```
result:

2 + ( 8 / 2 ) + ( 3 * 20 )

__66__
