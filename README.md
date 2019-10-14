# Library API
Custom library api used to stream/download personal library collection.

## Uses:
* [ExpressJS](https://expressjs.com/)
* [JWT Tokens](https://jwt.io/)
* [MongoDB](https://www.mongodb.com/)
* [tmux](https://github.com/tmux/tmux)

### Notes: 
To use a JWT secret other than the one used for dev, set the `API_SECRET` environment variable.

To connect to a MongoDB server, just set environment variables for:
  * `LIBRARY_MONGO_URL`
  * `LIBRARY_MONGO_USER`
  * `LIBRARY_MONGO_PASS`
 
Library API uses `tmux` as a way to help start up the express server on reboots, passing the environment variables through. It expects `.env` to be set in the base of the project.
