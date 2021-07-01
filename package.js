/* global Package */
Package.describe({
    name: 'socialize:commentable',
    summary: 'A package for implementing social commenting',
    version: '1.0.5',
    git: 'https://github.com/copleykj/socialize-commentable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom(['1.10.2', '2.3']);

    api.use([
        'socialize:likeable@1.0.5',
        'reywood:publish-composite@1.7.3',
    ]);

    api.imply('socialize:likeable');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
