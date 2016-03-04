'use strict';
const http = require('http');
const https = require('https');
const url = require('url');
const repos = require('./reposLoader');
const request = require('request');
const debug = require('debug')('git-anonymizer');

const server = http.createServer((req, res) => {
    'use strict';
    debug('Incomming Req: %s', req.url);
    debug('Request Method: %s', req.method);
    let parts = req.url.match(/\/(.*)\.git(.*)/);
    if (parts && parts.length === 3) {

        let id = parts[1];
        let gitRequest = parts[2];
        let props = repos[id];
        if (!props) {
            debug('    Repository not found');
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end();
            return;
        }
        debug('    repo id: %s', id);
        debug('    repo req: %s', gitRequest);

        let serverReq = request[req.method.toLowerCase()](props.url + gitRequest, () => debug('Request ended'));

        if (props.basicAuth) {
            debug('    auth token: %s', props.basicAuth);
            serverReq.setHeader('Authorization', 'Basic ' + props.basicAuth);
        } else if (props.user && props.password) {
            debug('    auth user: %s', props.user);
            debug('    auth password: %s', props.password);
            serverReq.auth(props.user, props.password, false);
        } else {
            debug('    Not auth data');
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Not auth data');
            return;
        }

        debug('Request piped');
        if (req.method === 'POST') {
            req.pipe(serverReq).pipe(res)
        } else if (req.method === 'GET' || req.method === 'HEAD') {
            serverReq.pipe(res);
        }
    } else {
        debug('Incorrect syntax: %s', req.url);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('URL incorrect syntax');
    }
});

server.listen(8880);