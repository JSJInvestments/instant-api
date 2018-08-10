## Packing up a private repository

Increment the version of the private repository in package.json (please follow the Semver rules) and commit this to the repository. Now create a "release" of your private repository - you can do this in GitHub by navigating to the Code tab and clicking "Draft a new release". Enter the Tag version (v1.0.0 for example), Release title and description, then click "Publish release".

Once you've created the release, download the Source code in "tar.gz" format in the Assets list to this "packages" folder.

## Install the private package

Run the following command:

```
    $ npm i ./packages/instant-api-2.2.0.tar.gz --save
```

**Note**: this will update the `package.json` file to include an entry such as:

```
    "dependencies": {
        "instant-api": "file:packages/instant-api-1.0.0.tar.gz"
    }
```

**Note**: you may need to add your ssh key to the ssh-agent in order to install packages like this, e.g.

```
    $ cd ~/.ssh && ssh-add id_rsa
```

## Development

It's possible to use this repository in development mode so that changes will be reflected in the parent codebase. This can be acheived by running `npm link` in this directory, then `npm link instant-api` in the parent repo's root directory. You may have to run the latter command after each new package is installed in the parent repo using `npm i`.
