
The Leverege UI interacts intimately with the Leverege API. The Leverege UI is the recommended way to interact with the API to do project setup. For instructions on how to setup your project on the Leverege Platform, refer to the [getting started](http://docs.leverege.com/docs/gettingStarted#getting-started) guide. The following are guides for common actions taken with the Leverege UI.

## Run API UI locally

```
npm run decrypt
```
Change the `IMAGINE_HOST_URL` in your `.env` accordingly (local vs hosted API Server URL)
```
npm start
```
## Reason Scripts 

To create a script, navigate to the `scripts` tab of the UI, create a script and add functionality to the script. [Reasoner documentation](http://docs.leverege.com/docs/reasoner) will assist when writing functionality. Save the script, and deploy it.

Next determine the trigger for the script. This trigger can be a timer, message route or a message on the reason topic. For creating a timer, read the [scheduling timers section](http://docs.leverege.com/docs/api-ui#scheduling-timers). Create this timer with the `Trigger Script` functionality, and copy the script id into the input. Input in JSON, the options that are needed, these will be passed into the script through the `params` key the [context](http://docs.leverege.com/docs/reasoner#context).

Details for setting up a message route can be found in the [Reason documentation](http://docs.leverege.com/docs/reason). When set up this way, the [context](http://docs.leverege.com/docs/reasoner#context) will contain deviceData, system, device and blueprint information.

The third was is to send a message from inside the platform on the `reason` topic. This is the least supported way, and not recommended.

## Creating Users 

To create a user, navigate to the users tab, and click `+ new user`. The required fields are `username` and `password`. Passwords need to be at least 6 characters. Once a user has been created, they can be permissioned on systems or devices. To permission a user on a system navigate to the system, then in the access tab, add the user and define their permissions. To permission a user on a device, use the api library, call `api.device( deviceId ).users().add( userId, permissions, metadata )` or use [Interface](http://docs.leverege.com/docs/interface). 

To create a project user, the an api call is required. `api.project( projectId ).users.create( user, permissions, metadata )`.

## Changing Device Attributes

Under the Blueprints tab, all the current Blueprints are visible, click on the Blueprint name to open an attribute editor. Here attributes can be deleted and created, and can be minimally edited. when adding an attribute, a type and units can be designated. Deep attributes can be created by including `/` separating the keys. If a attribute is created with an incorrect type or unit, it has to be deleted and recreated.  

## Creating a Simulation

Simulations are created under the Scenarios tab. The Scenarios are all tied to a blueprint. The UI allows for values to be changed on an hour time line. Click on the timeline to create a specific value at that time. Clicking on the line between two value points opens an editor for the interpolation, which also allows the update frequency to be changed. 

When creating a device, it can be specified as simulated, or a device can have its simulator turned on in its info tab. When clicking into the device details, when a device is simulated, it has a play button in the upper right, clicking on this opens a selector for scenarios. Once the simulation is run, it will begin to change the value as designated in the scenario.

## Scheduling Timers

Timers are created under the Timers tab of the UI. The [Scheduler](http://docs.leverege.com/docs/scheduler) service manages all of the timers. Timers can have several different end functionalities. these functionalities are 

1. Trigger Script
2. Query Url
3. Publish Topic

and specified through a dropdown. These functionalities have additional parameters that can be specified in the UI. The other main Attribute of Timers are when they are run. They can be specified to run once, at an interval, or a specific time everyday. This is changed in the `Timer` section of a timer.
