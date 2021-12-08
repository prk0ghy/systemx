# SystemX
Content management system for [Digitale Lernwelten](https://dilewe.de/) publications, created
with the unique requirements and preferences of the (German) Education sector in mind. This
caused us for example to completely firegap our final production artifacts from any running
CMS system that might fail, become exploited or limit horizontal scalability. Additionally
this approach makes it very easy for us to safeguard our users data (what we don't have, we can't loose).

## Users
- [eLearning Module des Freistaats Sachsen](https://module-sachsen.dilewe.de/)
- [Infoportal Russlanddeutsche in Hessen](https://russlanddeutsche-hessen.de/)
- [Jura-Museum](https://mguide-jura-museum.de/)
- [mVet - Portal für Tiermedizin](https://tagungsbaende.dilewe.de/)

# Prerequisites
- Node v16+ (current LTS)
- NPM

## Windows
When developing for SystemX on windows, you need to install the latest *Node.js*
LTS version with *NPM* included and having *git* would make things a lot easier
as well.

## MacOS
On MacOS systems using *homebrew* running `brew install node npm` should be
sufficient, *git* should be installed as well since it makes getting and updating
the source code much easier.

## Linux/BSD/*nix
There probably is a version of node and npm in your Distributions repository
already, just make sure that node is at least v14, otherwise, you will get
errors due to the usage of ESM and other newer features found in this codebase.

# Installation
Running `npm install` or `npm install dev` after cloning should, as the command suggests, install everything you need in order to run SystemX

## Development
Just run `npm install` in order to install all the prerequisites and then use `npm run dev:ssg` when working on the Content parts, or use `npm run dev:shop` when working on the portal.

## Linting
Before commiting it is advisable to run `npm run lint`, since those tests will be run by the CI/CD
pipeline again and it would be nice if the commit wouldn't fail in the pipeline, blocking an automatic roll-out.

# Architecture / Modules
SystemX is a collection of specialized modules, interacting with each other as needed.

## Administration
This module is used as a bridge between the CMS and the running production
system, can trigger a deployment, do rollbacks or create users.

## Common
This directory contains a lot of miscellaneous subroutines that are useful to many other
parts of the codebase, examples of this is options handling, or downloading files.

## ContentPipeline
This module is compiling content into other more useable forms, currently it mostly
takes data from a Craft CMS Instance via GraphQL and produces HTML and associated
assets, but will in the future be expanded to also consume from TYPO3 and XML as
well as producing XML.

## UserLogin
This module is intended to restricting access to content produced via the ContentPipeline,
allowing the purchase of said content as well as persisting user state and allowing for
communcation and interaction between logged-in users in cases where we need a centralized
system.

## UserTracking
This module is meant to be used as a minimally invasive user tracking, intended
for situations where we have to keep count of page accesses but not intended 
for analytics.