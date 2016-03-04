'use strict';
const rawRepos = require('./repos.json');
const repos = {};

if (rawRepos.byName){
    for(let key in rawRepos.byName){
        repos[key] = rawRepos.byName[key];
    }
}

if (rawRepos.byBasicAuth){
    for(let token in rawRepos.byBasicAuth){
        for(let key in rawRepos.byBasicAuth[token]){
            repos[key] = {
                basicAuth: token,
                url: rawRepos.byBasicAuth[token][key]
            }
        }
    }
}

if (rawRepos.byUserPass){
    for(let auth in rawRepos.byUserPass){
        for(let key in rawRepos.byUserPass[auth]){
            repos[key] = {
                user: auth.split(':')[0],
                password: auth.split(':')[1],
                url: rawRepos.byUserPass[auth][key]
            }
        }
    }
}
module.exports = repos;
