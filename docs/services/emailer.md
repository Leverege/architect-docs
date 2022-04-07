 
Emailer's function is to receive email requests in the form of an `EmailMsg`, queue them, and then forward them to a service that will send the email. Currently Emailer is configured to use the [MailGun api](https://www.mailgun.com/), but Emailer can be configured for other services' apis such as SendGrid.

Emailer listens to the messaging service set up with the Leverege Platform. The default message reading configuration is NSQ, and the topic that emailer listens to is `email`. The format of the message is an `EmailMsg`, which can be found in the [Messages](http://docs.leverege.com/docs/messages) library, and an example is given below.

A message starts by invoking the `route` method on an instance of a writer created by [Message Queue](http://docs.leverege.com/docs/message-queue) with the `email` topic and an instance of an `EmailMsg`. Message Queue writes the message to the Transponder service, which then routes it to this service (Emailer). Emailer does a validation check to make sure the message received is an instance of an `EmailMsg`. If there is a `templateId` provided, Emailer fetches the HTML template, and [Handlebars](https://handlebarsjs.com/builtin_helpers.html) is used to insert values from the `context` into the template. The Message is then sent to [Mailgun](https://www.mailgun.com/) for the email to be sent to the client.

## Configuration

#### Required 

There are 4 config variable that are required to run this service.

| Name | Description |
| ---- | ----------- |
| MAIL_GUN_API_KEY | Mailgun Api Key |
| MAIL_GUN_DOMAIN | Mailgun domain to send emails from|
| MODEL_FIREBASE_SERVICE_ACCOUNT | service account key to firebase database |
| MODEL_FIREBASE_DATABASE_URL | url to firebase database |

#### Optional

There are 11 config variables that have defaults set that will need to be specified in the environment if the default is incorrect.

| Name | Description | Default | 
| ---- | ----------- | ------- |
| EMAIL_TEMPLATES_DIR | file path to where email templates are stored | `null` | 
| TRANSPORT_CONFIG | config for readers and writers | `{ type, host, port }` |
| NSQ_HOST_ADDR | host address for NSQ, not needed if TRANSPORT_CONFIG is specified | `'127.0.0.1'` |
| NSQ_HOST_PORT | port for NSQ, not needed if TRANSPORT_CONFIG is specified | `4150` |
| CACHE_CONFIG | configuration for the cache db | `{ type, connection : { host, port } }` |
| LIMIT_CONFIG | configuration for the limit db | [Limit](http://docs.leverege.com/docs/limit) |
| MAIL_ATTEMPTS | maximum number of delivery attempts before aborting | `3` |
| MAIL_ATTEMPT_DELAY | delay enforced between email attempts | `30000` | 
| MAIL_GUN_TEMPLATES | string representing the path to the Mailgun templates | `'./templates/email/'` |
| MAIL_GUN_DEFAULT_SENDER | default sender email address | `'team@leverege.com'` |
| API_SERVER | url of the Leverege api | `'https://imagine.leverege.com:8181'`

## EmailMsg

A more detailed message spec can be found in the [Messages](http://docs.leverege.com/docs/messages) library.

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | string or array | recipients' email addresses |
| cc | string or array | carbon copy email list |
| bcc | string or array | blind carbon copy email list |
| subject | string | subject line |
| text | string | optional message in plain text format |
| html | string | optional message in html format |
| template | string | id of the template to use |
| context | object | object to give to the template |
| attachments | array | attachment list |
| attachments[n].filename | string  | name of the attachment that the recipients will see |
| attachments[n].url | string | source of a file to send as attachment |
| attachments[n].content | string | base64 encoded content. Don't use this if url is specified |
| attachments[n].encoding | string | normally "base64" |

