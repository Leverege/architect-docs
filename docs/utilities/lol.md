
Leverege Operational Lexicon, or LOL is a cli tool for interacting with the Leverege API. It makes and curls every request possible to the Leverege API. This can be used for many different things from testing to sending data.

## Install
```
npm install -g @leverege/lol
```

## Usage
```
  lol help

  Usage: lol [options] [commands]

  To pass complex objects, use JSON objects wrapped in single quotes.

  Commands:
    help : this message
    set host <host> : sets the host to connect to
    set project <project id> : sets the project id to use by default

    projects : lists the available projects
    projects create <obj> : creates a project
    projects help : lists the projects options

    users : list the platform users
    users help : list users options

    project <id> : gets the project
    project <id> help : lists the available options on the project
    project <id> update : lists the available options on the project
    project <id> <resource> : lists the projects resources, where:

      <resources> include members, accounts, apiAccess, networks, scripts,
      systems, messageRoutes, scenarios, timers, blueprints

      If the lol set project <projectId> is used, this
        lol project xxx blueprints
      can be reduced to
        lol blueprints

    project <id> : returns the project's information
    project <id> help : list the projects options
    blueprint <id> : returns the blueprint's information
    blueprint <id> help : list the blueprints options
    attribute <id> : returns the attribute's information
    attribute <id> help: list the attribute options
    system <id> : returns the system's information
    system <id> help : list the system options
    device <id> : returns the device's information
    device <id> help : list the devices options
    messageRoute <id> : returns the messageRoute's information
    messageRoute <id> help : list the messageRoute options
    script <id> : returns the script's information
    script <id> help : list the script options
    apiAccess <id> : returns the apiAccess's information
    apiAccess <id> help : list the apiAccess options
    timer <id> : returns the timer's information
    timer <id> help : list the timer options
    user <id> : returns the user's information
    user <id> help : list the user options

    interface <system> <type> : calls the interface

    getDeviceByNetworkAlias <networkId> <propertyKey> <value> : returns the device with the given network id
    forgotPassword <username> <projectId> : send password reset message
    resetPassword

  options:
    -extract <path> : This will print the value from the result specified by path.

```

## Examples

To list your projects
```
lol projects 
```

To list blueprints in a project
```
lol project <id> blueprints
```

To change the name of a blueprint
```
lol blueprint <id> update '{"name" : "My New Name" }'
```


