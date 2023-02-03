# FileSaver Front

## DEV information:

This sub-folder is organized as:

-   `./src`: complete source code for the front
    -   `./components`: React components that can be embedded inside different pages
    -   `./config`: configuration for the front app
    -   `./interactions`: wallet integration & reading chain state
    -   `./pages`: app pages that have a corresponding URL associated
    -   `./style`: CSS files (later it will be converted to .SCSS)
-   `.env`: environment variables
    -   (they have to start with `REACT_APP_` prefix for them to be available as `process.env.REACT_APP_...`)
