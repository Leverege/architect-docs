---
id: concepts
title: Core Concepts
---

This describes the various objects used in the Leverege Platform. All of these can be accessed and manipulated using the `api` library.

## Project

Projects hold most of the other pieces in the platform, such as blueprints, systems, message routes, and scripts. A Project has have Project specific Users (accounts), that are used to assign access to Systems and Devices.

## Blueprint

A Blueprint is used to define both IoT device data, and organizational data and relationships. Blueprints can have an alias that is useful when accessing data via the Model Interface API. The alias defines a human readable unique name for the model. Each Blueprint has a set of attributes. Messages for a Device can be routed based on its Blueprint type, allowing different handling of different data types.

## Attribute

An Attribute defines a field in a Blueprint. There are several types of Attributes such as string, numbers, units, timestamps and relationships.
The Attributes can be used to dynamically interpret data in a Device.

## Device

A Device represents a thing, either an IoT device or an organizational construct. Each Device has a Blueprint that defines what kind of thing it is. Internally, a Device has an platform generated id. The Device can have multiple source specific ids as well. It is captured through the concept of a network alias. The network alias consists of a Network Id, a alias key, and a value. An example of this triplet might be ('boat-network', 'esn', '5551212' ). This triplet allows the platform to map the external id to the internal id. 

Project Users can also be assigned permissions on a Device.
 
## System 

A System holds a collection of Devices. Project Users can be given access rights to a System, allowing different users to access different collections of Devices.

## Network

A Network represents a source of device data. When a device needs to be contacted, the Network is used as the target. In particular, messages are published to the `<networkId>-outbound` topic. The ingestion service setup to manage that network's data can listen on this topic and then communicate appropriately to the source server. The Network Id is also part external identity of a Device.

## Message Route

A Message Route defines how a particular Message type ( `deviceDataEventMsg` for example ) is acted upon. This is used to select which reason scripts will run when a new data for a Device is received.  

## Reason Script

A Reason Script is code that can be run in response to new Message or a Timer. These Scripts are used to supply business logic to your project. Actions like Sending out a daily status email or calculating alert states and sending notifications when they occur would fall under the domain of a Reason Script. These Scripts can also interface with external systems, as needed.

## Reason Trigger

The Reason Triggers are like Scripts, but without having to write code. For many simple tasks such as sending alerts when a device is in a certain state for a certain amount of time, triggers will be easier to setup than a Script.


## Timer

A Timer represents a task that needs to be trigger in a certain amount of time, or repeatedly. These are often used to tell a Reason Script to run periodically. 

## Template

Templates are used to create branded emails or SMS notifications. When Reason triggers a `send email` request, a Template Id and contextual data can be supplied to produce the branded email. 

## Scenario

A Scenario defines how data values for a particular Blueprint change over time. It uses a key framing system to allow the user to set values at given points in time. The intermediate values are computed by a function that exists between two key frame values. A Scenario can be played on a Simulated device.

## User

There are two types of users in the Leverege Platform:
  * Platform User
  * Project User

 Platform Users are users that can create and edit a Project and all of the supporting pieces such as Blueprints, Networks, Scripts. 

 Project Users are end users of the resulting product. They have access to Systems and Devices. Project User names are unique to a Project, so two different Projects can have a user with name 'demo'.
 

## Api Access

The Api Access key is used to allow a server to communicate with the Api Server as an admin of the project without having to login. This key is used with the `api-service` library.

