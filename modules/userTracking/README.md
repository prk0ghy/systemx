# user-tracking

## Usage
```sh
$> pnpm start # from the module directory
$> pnpm user-tracking # from the root of the repository
```

A small module to track anonymized page accesses.

The module expects a `POST` requests to `/stats` with following schema:
```json5
{
    "guid" : "guid...",
    "domain": "domain...", // must be an URL
    "location": "location..."
}
```

The inputs are validated with Regex and the service will reply with `HTTP 400` if the input isn't valid.

## Configuration
Copy the `.env.example` to `.env` and adjust the values accordingly.

### `USER_TRACKING_STORAGE_PATH`
Where the `sqlite` file will be stored. (default: `./.sqlite/`)

### `USER_TRACKING_PORT`
On which port the tracking will run. (default: `1234`)

### `USER_TRACKING_TARGET`
Currently unused, will likely be removed in the future.