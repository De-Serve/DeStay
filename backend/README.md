# Booking Hotel Server

MongoDB, Express, Node

## Usage

### Prepare JWT secret

run the script at the first level: (You need to add a JWT_SECRET in .env to connect to MongoDB)

```terminal
$ echo "JWT_SECRET=YOUR_JWT_SECRET" >> src/.env
```

### Start

```terminal
$ cd server   // go to server folder
$ npm        // npm install packages
$ npm run dev    // run it locally
// http://localhost:8000 be available
$ npm run build  // this will build the server code to es5 js codes and generate a dist file
```



