# SystemX
Static site generator and shop for Dilewe contents.

## Prerequisites
- Node v14+
- NPM

## Installation
Just execute `npm install` in order to install all the prerequisites and then use `npm run mon:ssg` when working on the Content parts, or use `npm run mon:shop` when working on NATTER.

## Linting
Before commiting it is advisable to run `npm run lint` before commiting, since those tests will be run by the CI/CD
pipeline and it would be nice if the commit wouldn't fail in the pipeline.

## Environment variables
- `NODE_ENV` (either `production` or `development`)
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`