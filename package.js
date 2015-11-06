Package.describe({
    name: "socialize:commentable",
    summary: "A package for implementing social commenting",
    version: "0.2.0",
    git: "https://github.com/copleykj/socialize-commentable.git"
});

Package.onUse(function(api) {
    api.versionsFrom("1.0.2.1");

    api.use("socialize:likeable@0.2.0");

    api.imply("socialize:likeable");

    api.addFiles("common/commentable-model.js");
    api.addFiles("common/comment-model.js");
    api.addFiles("server/server.js", "server");


    api.export(["CommentableModel", "Comment"]);
});
