# user-login backend

## Configuration

For development you can copy the `.env.example` file to `.env`.  
You will need to set the following environment variables:  

- `USER_LOGIN_API_DOMAIN` : the url for the frontend
- `USER_LOGIN_API_PORT` : the port on which to run the API
- `USER_LOGIN_API_STORAGE_PATH` : in which directory the sqlite db is stored
- `USER_LOGIN_API_COOKIE_NAME` : how the cookie is named
- `USER_LOGIN_API_PAYPAL_CLIENT_ID` : paypal API
- `USER_LOGIN_API_PAYPAL_CLIENT_SECRET` : paypal API
- `USER_LOGIN_API_MOUNT_BASE_DIR` : where the base directory of the mounts is
- `USER_LOGIN_API_MOUNTS` : a JSON array of groups/mounts

To send emails you will need to set:

- `SYSTEMX_MAIL_HOST`
- `SYSTEMX_MAIL_PORT`
- `SYSTEMX_MAIL_USER`
- `SYSTEMX_MAIL_PASSWORD`
- `SYSTEMX_MAIL_FROM`

For development you can use the docker-compose file in this directory:

```sh
$> docker-compose up -d
```
Set the following in you `.env` file:  

- `SYSTEMX_MAIL_HOST=localhost`
- `SYSTEMX_MAIL_PORT=1025`
- `SYSTEMX_MAIL_USER=user`
- `SYSTEMX_MAIL_PASSWORD=pw`
- `SYSTEMX_MAIL_FROM=test@dilewe.de`

Visit `localhost:8025` to see the inbox.



