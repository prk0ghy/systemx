# Coding Guidelines
None of these are set in stone, if you can make your case good enough then
these might actually change.

## Software requirements
You should only need node/npm/git for now, maybe ffmpeg/graphicsmagick in the
future. Serverside deployments should use Alpine Linux.

## Code/Documentation only in english
This is because discussing programming related topics in german turns
into a 50/50 mix of english and german words most of the time. Also
opens to door to international contributors.

## Everything should be developed in your personal branch
After having accumulated some commits make sure that your commit
messages are ok, eslint shows no errors and think about squashing
your commits. Then write on the slack channel that you have some
changes that are ready to be merged and someone (most likely me, Ben)
will see to it as soon as possible.

The Personal branches are mostly to protect against rewriting history
on the master branch, which always turns into a hassle. This also enables
others to look at your code and collaborate while still preserving you
the ability to rewrite history at a later time without interfering with
others work. This also means that you should **never** branch from someone
elses private branch.

## Indent with tabs, align using spaces
The only correct way of indentation, if you editor supports EditorConfig
your editor should do the right thing, including a single LF for line breaks.
