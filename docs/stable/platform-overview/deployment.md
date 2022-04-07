---
id: deploying
title: Platform Setup
---
The Leverege Platform is a collection of services that implements various IoT-related tasks. Each services is available via a Docker image on Google Container Registry and can be deployed via Docker, Docker Swarm, or Kubernetes. The reference architecture is based on Google Kubernetes Engine (GKE), but the Leverege Platform can be deployed onto other cloud providers by configuring it with equivalent services (e.g. NSQ in lieu of Google Pub/Sub for message queue).

At the time of writing, the supported services are as follows:
  * Message Queue: NSQ, Pub/Sub
  * Database: MySQL, Postgres, TimeseriesDB, Firebase/FireStore, BigQuery
  * Cache: Redis, Memcache
  * Search: ElasticSearch
  * Notification: Twilio, Mailgun
  * Serverless: Cloud Functions, Cloud Run (Knative), OpenFaaS
  * Monitoring: Prometheus, StackDriver

## Deploying
 
The following deployment guide is optimized for Kubernetes via Helm. Standard Kubernetes manifests are also supported. If custom components must be added, new Deployments/DaemonSets can be added via Helm/Kubernetes or translate docker-compose files via [Kompose](https://github.com/kubernetes/kompose).

### Getting Started

Baseline GCP setup can also be configured via Terraform, but if modifications are necessary, following the setup guide below. 

#### Required Setup

1. GCP Project with Billing Enabled:
  * Kubernetes Instance (GKE or GCE with Kubernetes installed)
  * SQL (Cloud SQL or self-hosted MySQL, Postgres, or TimeseriesDB)
  * Access to Pub/Sub, Container Registry, GCS, Firebase

2. On Firebase:

  * Link Firebase project to GCP project
  * Make sure to enable backups: Database → Backups 
  * Configure access based on security needs

3. Third-Party Services :
  * SMS: Twilio
  * Email: Mailgun
  * [gcloud](https://cloud.google.com/sdk/docs/#install_the_latest_cloud_tools_version_cloudsdk_current_version)
  * [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
  * [Helm](https://github.com/helm/helm)
  * DNS Provider and SSL certificate for HTTPS support (e.g. Cloudflare)

#### Installing

Install [ChartMuseum](https://chartmuseum.com/) and obtain a service account to access Helm charts for Leverege Platform Docker images. 

Clone [platform-k8s](https://bitbucket.org/leverege/platform-k8s/src/master/) and fill out overwhelm.yaml with project specific sections (e.g. host name, projectId, etc).

In the project directory run:

```
npm install
```

#### Deployment

1. Obtain Service Accounts and Configs from all the Firebase databases:

  * Go to the [Firebase console](https://console.firebase.google.com)
  * Click on the desired project
  * Click on the settings icon in the top-left corner of the page
  * Click on "Project Settings" in the subsequent dropdown
  * Click on the tab for "service accounts"
  * Ensure that the tab for "Firebase Admin SDK" is selected
  * Click the button "GENERATE NEW PRIVATE KEY" (project owner/admin permission level required)
  * Click "GENERATE KEY"
  * Go back to the top and click the tab "GENERAL"
  * Click the button "Add Firebase to your web app"
  * Copy out the config object into a local file
  * Convert the config object into actual JSON (surround the object keys with ")
  * Repeat for all Firebase databases
  * Move Service Account and Config files into scripts/platform-secrets inside this folder
  * Rename RT database service account -> rt-data
  * Rename RT database config -> rt-data-config
  * Rename Service database service account -> srv-data
  * Rename Service database config -> srv-data-config
  * Rename Model database service account -> model-data
  * Rename Model database config -> model-data-config

2. Obtain a Service Account for CloudSQL and BigQuery:

  * Get access to `leverege-docker-images` Container Registry
    * Go to your project → IAM → Service Accounts and copy the default Compute Engine Service Account email address (e.g. <123123-compute>@developer.gserviceaccount.com)
    * Go to leverege-docker-images → IAM → Add → Paste the above and give it Storage Object Viewer Role
  * Go to the [GCP console](https://console.cloud.google.com)
  * Switch projects to the project you are using for deployment
  * In the sidebar go to the IAM & Admin section
  * Click on the service accounts option in the sidebar
  * Create three service accounts (one for BQ, one for CloudSQL, one for Pub/Sub)
    * CloudSQL: SQL Client 
    * Pub/Sub: Pub/Sub Editor
    * BigQuery: Data Editor & Job User
  * Create and download a key for each account in JSON 
  * Move Service Account credentials into a secure location to load onto Kubernetes as secrets. 

3. Obtain Twilio and Mailgun API keys

4. Create a user for CloudSQL 

5. Obtain SSL Certificate 

6. Get credentials for the GKE cluster - [GKE Documentation](https://cloud.google.com/kubernetes-engine/docs/quickstart)

```
$ gcloud config set compute/zone <zone-name>
$ gcloud config set project <project-name>
$ gcloud container clusters get-credentials <cluster-name>
```

7. Initialize Helm with RBAC 

First make tiller.yaml

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tiller
  namespace: kube-system
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: tiller-clusterrolebinding
subjects:
- kind: ServiceAccount
  name: tiller
  namespace: kube-system
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: ""
```

```
$ kubectl create -f tiller.yaml
$ helm init --service-account tiller --upgrade
```

8. Run `Deploy_Platform` script under platform-k8s/scripts and follow the prompt

9. Deploy Platform UI via Firebase Hosting or GCS. 