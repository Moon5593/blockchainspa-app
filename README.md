# BlockchainSPAApp
This is a full MEAN stack application. This app calculates hash's by taking some input from user. When data of one of the block changes, the reflection is seen in the user interface. When the data change's the tool button (blue icon) is given so as to save the changes. The changes are first calculated and then reflected in the backend. The input providing is not mandatory as empty string's hash is also calculated and it is valid as per the way how SHA crypto hashing works.
Register first and then login to see the core Blockchain application.
Application is deployed on Amazon Elastic Beanstalk, link - http://blockchainspathree-env.eba-gyufdegd.us-east-2.elasticbeanstalk.com/

## Frontend (Angular)
The frontend has 3 components namely login, signup and blockchain-list. The login and signup is both looks identical. This application uses Ant Design which is a library like bootstrap, angular material to style the application. The reason to use the Ant Design was since this app had to be clone of blockchaindemo.io which also uses Ant Design. The official link to this librabry is https://ng.ant.design/docs/introduce/en.

This application also uses guard, interceptor and lazy-loading to ensure the security and storage efficiency (lazy-loading ensures only the current route and its related components gets loaded rather than loading complete application resources as soon as the app gets loaded).

The error interceptor forwards the application errors to error component which in turn is the component that hosts the alert box.

## Backend
The backend is based on MongoDb Atlas. Mongoose driver is used to handle requests easily in nodejs. The cluster in Atlas has two collections namely "users" and "blocks". As their name says "users" collection has all the users entries and "blocks" collection has our all the list of blocks with creator field so as to differentiate which block is created by which user.

## Authentication
The blocks retrieved by the backend is completely unique according to the user who created it. If the tool icon of the block is clicked, the block change is reflected as per the hash change and the user who created it.

## Deployment
The application is deployed to Amazon elastic beanstalk. The production files in the backend folder are built and deployed. The 'path' nodejs package ensures that the requests from our frontend side are handled correctly by our server.