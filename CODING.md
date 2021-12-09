# Coding Guidelines
None of these are set in stone, if you can argue your case good enough then
these will change :)

## Software requirements
You should only need node/npm/git for now, if you want to build releases you also need
GraphicsMagick. The distros of choice for **production** systems are **Debian** and **Alpine Linux**, while development mostly happens on **Arch Linux**.

## Code/Documentation only in english
This is mostly because discussing programming related topics in german turns
into an incomprehensible german/english mix.
This also opens the door to international contributors!

## Do risky stuff in your personal branch / feature branch
Apart from that feel free to just work directly on the master branch and test the tests.

## Indent with tabs, align using spaces
The only correct way of indentation, if you editor supports EditorConfig
your editor should do the right thing, including a single LF for line breaks.

## Prefer arrow syntax over function keyword
This is mostly because let/const have more intuitive scoping rules and it's nice to stay consistent.
