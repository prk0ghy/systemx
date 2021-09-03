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

## How to Build and Deploy a LASUB Release
```
# Build a release on the dev server
ssh dev.dilewe.de "cd /var/www/html/dilewe.de/systemx/ && npm run build:release"
# Rsync it over to the live server and change the symlink
ssh live.dilewe.de "cd /var/www/html/dilewe.de/module-sachsen/ && RELEASE=\`date \"+%Y%m%d\"\` && mkdir -p \"\$RELEASE\" && rsync -avhe ssh dev.dilewe.de:/var/www/html/dilewe.de/systemx/web/lasub/ ./\$RELEASE && ln -s \$RELEASE next && mv current last && mv next current"
```