# Architecture
SystemX is split up into multiple modules, serving different purposes.

## Common
This directory contains a lot of miscellaneous subroutines that are useful to many other
parts of the codebase, examples of this is options handling, or downloading files.

## Portal
This module contains an implementation of a shop where users might buy access to
SystemX contents. Although all shop functionality might be disabled so it becomes
a user portal, restricting access and saving user data across devices.

## SSG
Here we have the static site generator producing generating a bunch of static
files by communication with a separate CMS System, though we currently only
support a GraphQL interface of Craft CMS this will be more generalized in the
future so we can also get contents from TYPO3.
