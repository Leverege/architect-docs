# Cluster Manager


ClusterManager will start and restart child processes. It will also allow control
of the those processes via a service express port. The log levels of the children
can be set, the status of the cluster can be queried and the children can be restarted.



# Initial Setup
```
npm install @leverege/cluster-manager --save

const ClusterManager = require( '@leverege/cluster-manager' )

```


# Usage

The ClusterManager installs graceful async exit handlers using ```@leverege/exit``` so it s recommended
that you install and use that library. 

There are two ways of using this class. The passed in function is the recommended use.

```

Exit.installDefaultHandlers()

const options = { /*...*/ }
ClusterManager.start( options, 
  ( ) => { MyServer.start( cfg ) } 
)
```

If you need to start special processing in your master process, you can use the third argument:
```
const options = { /*...*/ }
ClusterManager.start( options, 
  ( ) => { MyServer.start( cfg ) }, 
  ( ) => { MyMasterProcess.start( cfg ) }
)
```
By default, the ```options.count``` value use the env variable CM_MAX_CHILD_PROCESSES or MAX_CHILD_PROCESSES or 32 clamped to the number of cpus to determine the number of child processes to start. Often, for Kubernetes deployments, you will 
want to set MAX_CHILD_PROCESSES to 1. If your process MUST have only 1 (or N) children, set count explicitely.


The old method still works, but is more verbose:

```
if ( ClusterManager.isMaster ) {

  ClusterManager.start( { } )

} else {

  MyServer.start( Config )
  ClusterManager.connectToParent( { updateStatusMs : 10000 } )

}
```

# Express Options

If you set the webServerPort to a number, like 5111, you can do the following:

http://hostname:5111/
  This will show the current status in JSON form

http://hostname:5111/logLevel/:level
  This will set the log level of the parent and child processes. Valid values of :level
are 'trace', 'debug', 'info', 'warn', 'error', or 'fatal'

http://hostname:5111/children/exit
  This will stop all child processes. If autoRestart is true, they will be restarted

Ideally, this would be behind a firewall and not accessible to the world.

By default, webServerPort will default to ```process.env.CM_WEBSERVER_PORT```.


# Child Processes

When started, a child process will be given a CM_CHILD_ID process.env argument that will remain
the same through restarts of the child process. The log functions use this to continue writing to
the same log file.

On a restart, CM_RESTART will be set to the number of restarts that have occured on that child id.
ClusterManager.isRestart will be true if the current fork is the first instance run for that id.

