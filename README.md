# SystemX
Static site generator and user portal for [Digitale Lernwelten](https://dilewe.de/) publications.

## Users
- [eLearning Module des Freistaats Sachsen](https://module-sachsen.dilewe.de/)

## Prerequisites
- Node v14+
- NPM

### Windows
When developing for SystemX on windows, you need to install the latest *Node.js*
LTS version with *NPM* included and having *git* would make things a lot easier
as well.

### MacOS
On MacOS systems using *homebrew* running `brew install node npm` should be
sufficient, *git* should be installed as well since it makes getting and updating
the source code much easier.

### Linux/BSD/*nix
There probably is a version of node and npm in your Distributions repository
already, just make sure that node is at least v14, otherwise, you will get
errors due to the usage of ESM and other newer features found in this codebase.

## Installation
Running `npm install` or `npm install dev` after cloning should, as the command suggests, install everything you need in order to run SystemX

## Development
Just run `npm install` in order to install all the prerequisites and then use `npm run mon:ssg` when working on the Content parts, or use `npm run mon:shop` when working on the portal.

## Linting
Before commiting it is advisable to run `npm run lint`, since those tests will be run by the CI/CD
pipeline again and it would be nice if the commit wouldn't fail in the pipeline, blocking an automatic roll-out.
