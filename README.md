# git-anonymizer
The idea of this project is to provide anonymous access to repositories that require credentials to be cloned.

This is very useful to allow for example: Internal GitLab repositories inside a company, when the public access is restricted.

You can configure an internal repository with a common set of credentials and allow all the users to clone the repository by this service.

If you have a bower component in an internal repository, you can configure bower to install it from the service and no from the real repository.

## Index
* [Disclaimer](#disclaimer)
* [What is supported](#what_is_supported)
    * [By Name](#by_name)
    * [By AuthToken](#by_authtoken)
    * [By User & Password](#by_user_&_password)
    * [repos.json Example](#repos.json_example)
* [Usage](#usage)
    * [For example](#for_example)
* [IISNode use](#iisnode_use)

## Disclaimer
Take in mind that you are making public something that really is private.

I don't recommend use this with private repositories, with internal repositories you need to have in mind that this service should reside inside a controlled network.

## What is supported

By now, the service only clone repositories. Supporting The Smart HTTP protocol.

Because of that, you always need to clone with a HTTP URL and not a Git URL.

## Configuration
There are some configurations in the ```package.json```:
* ```port```: HTTP port to listen.
* ```cluster.cpu```: Count of child proccess created in cluster mode. (1 for no cluster)
* ```cluster.autoRestart```: To restart killed child proccess.

And the ```repos.json``` file should be filled with the repositories allowed to be cloned.

The json can manage repositories in three groups:

### By Name
This is the most basic way, each property of the ```byName``` object should be the repository key.
That property should be an object with the following structure.

* ```url```: HTTP URL to the real repository.
* ```user```: User  to be used in the Basic HTTP Auth
* ```password```: Password to be used in the Basic HTTP Auth
* ```basicAuth```: Basic HTTP Auth token

The ```url``` is mandatory. If ```basicAuth``` is present, will be used and ```user``` and ```password``` will be discarted.

### By AuthToken
This way allow to group a bunch of repositories to be accessed with the same auth info. Avoiding to copy the auth info many times. Each property of the ```byBasicAuth``` object should be the basic HTTP Auth token.

That property should be an object with *N* properties, each property should be the repository key and the value the HTTP URL to the real repository.

### By User & Password
This way allow to group a bunch of repositories to be accessed with the same auth info. Avoiding to copy the auth info many times. Each property of the ```byUserPass``` object should be the user and password to be used in the Basic HTTP Auth.
With this syntax: ```username```:```password```.

That property should be an object with *N* properties, each porperty should be the repository key and the value the HTTP URL to the real repository.

### repos.json Example
```javascript
{
    "byName": {
        "ManRueda/git-anonymizer1": {
            "user": "my.super.user@some.com",
            "password": "XXXXXXXX",
            "url":"https://github.com/ManRueda/git-anonymizer.git"
        },
        "ManRueda/git-anonymizer4": {
            "basicAuth": "bWFudNvbTpCYWdfNrVHJhY2sLmNvbTpCYWNrVHJhY2syMDEz",
            "url":"https://github.com/ManRueda/git-anonymizer.git"
        }
    },
    "byBasicAuth": {
        "bWFudNvbTpCYWdfNrVHJhY2sLmNvbTpCYWNrVHJhY2syMDEz": {
            "ManRueda/git-anonymizer2": "https://github.com/ManRueda/git-anonymizer.git"
        }
    },
    "byUserPass": {
        "my.super.user@some.com:XXXXXXXX": {
            "ManRueda/git-anonymizer3": "https://github.com/ManRueda/git-anonymizer.git"
        }
    }
}
```

## Usage
To use this service you need to use git clone with the URL pointing to the service with this syntax.
```http://localhost:8880/{{repository key}}.git```

### For example
The real repository is: ```https://github.com/ManRueda/git-anonymizer.git```

My configuration could be something like this:
```javascript
{
    "byName": {
        "ManRueda/git-anonymizer": {
            "basicAuth": "bWFudNvbTpCYWdfNrVHJhY2sLmNvbTpCYWNrVHJhY2syMDEz",
            "url":"https://github.com/ManRueda/git-anonymizer.git"
        }
    }
}
```

To clone the repo with service, i could run this:
```bash
git clone http://localhost:8880/ManRueda/git-anonymizer.git
```

## IISNode use
To use it with IISNode, have in mind to deactivate the cluster mode and manage the cluster with IISNode.