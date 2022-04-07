---
id: gettingStarted
title: Building a Project
---
Leverege Platform organizes resource hierarchy by projects, systems, and devices . Each instance of the Leverege Platform can support one or more projects, which can each hold multiple systems and devices. In other words, multi-tenancy is supported at each resource level.

IAM roles can be granted on each level of the resource hierarchy. An admin user can create projects, systems, devices, and other users. A member of a project is restricted access to specified projects, but have read/write access to all resources defined at the project level (e.g. systems, metadata, users). Finally, accounts are users with read/write access defined at the system and device level. If an account has admin access, it can create other accounts and control permissions for allowed systems. Accounts without admin access can interact with devices or device relationships. 

## Getting Started

1. Create a new project
2. Define the Blueprint (digital representation) for each device with attribute fields and simulation items (if necessary)
3. Create organizational Blueprints to represent organization relationships if necessary
  - Organizational devices can be powerful ways to grant permissions to users. In addition to this, queries can be constructed on relationships. I.E. A company can have divisions, which can have employees. This way, A CEO or president can have access to all the devices in their company, and each division leader can have access to all devices in their division. There also enables a quick way to query for all the employees in one division
4. Create a System. A System is a collection of one or more devices.
  - Provide a system alias for a human readable label for systems 
5. Create user accounts as needed
  * Users can be added to the system through the Access tab of the system
  * To add users to specific devices, use the [API](http://docs.leverege.com/imagine-api.html#imagine-api)

## Ingest Data

In order to ingest data onto the Leverege Platform, data must be sent in the `inboundDataEventMsg` format via a REST endpoint or by custom servers. In order to create a custom ingestion server: 
 
1. Create a copy of the server template in [dev-utils](https://bitbucket.org/leverege/dev-utils/src/master/templates/server/) 
2. Define necessary ingestion, parsing, and authentication protocols
3. Define the `api` and `imagine` fields within Config.js to point the server to the correct project/system. 

## Deployment

Ingestion servers can be deployed as a Docker container or a serverless function. 

To deploy as a Docker image, run the `dockreate` script from [build-tools](https://bitbucket.org/leverege/build-tools/src/master/) to create an image on GCR. Now the server can be deployed on a VM with Docker support or on Kubernetes via Kubernetes manifests or Helm. 

To deploy as a function, host the server on any managed serverless services (e.g. Google Cloud Functions, AWS Lambda) or if the project supports OpenFaaS, use the CLI to deploy to [OpenFaaS](https://docs.openfaas.com/cli/install/).

For long running jobs, Kubernetes deployment is recommended.  

## Creating the UI

There are several front-end libraries and templates to assist and expedite creating a UI.

### Libraries

The combination of [UI Builder](http://docs.leverege.com/docs/ui-builder) and [UI-elements](http://docs.leverege.com/docs/ui-elements) allows for quickly styling and re-styling the UI. UI-elements has many react-widgets to help quickly make new UIs. [api](http://docs.leverege.com/docs/api) and [api-redux](http://docs.leverege.com/docs/api-redux) are libraries enabling quick ajax calls to the Leverege API. There are also several other different libraries to help make UIs.
