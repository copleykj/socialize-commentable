/* global Package */
Package.describe({
    name: 'socialize:commentable',
    summary: 'A package for implementing social commenting',
    version: '1.0.1',
    git: 'https://github.com/copleykj/socialize-commentable.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');

    api.use([
        'socialize:likeable@1.0.0',
        'socialize:user-blocking@1.0.0',
        'reywood:publish-composite@1.5.2',
    ]);

    api.imply('socialize:likeable');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js');
});
