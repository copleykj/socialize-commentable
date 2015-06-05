CommentsCollection.allow({
    insert: function (userId, comment) {
        return userId && comment.checkOwnership();
    },
    remove: function (userId, comment) {
        return userId && comment.checkOwnership();
    }
});

CommentsCollection.after.insert(function (userId, comment) {
    //when a comment is added, update the comment count for the object being commented on
    var collection = Comment.getCollectionForRegisteredType(comment.objectType);
    collection && collection.update(comment.linkedObjectId, {$inc:{_commentCount:1}});
});

CommentsCollection.after.remove(function (userId, comment) {
    //when a comment is deleted, update the comment count for the object being commented on
    var collection = Comment.getCollectionForRegisteredType(comment.objectType);
    collection && collection.update(comment.linkedObjectId, {$inc:{_commentCount:-1}});

    //if there are any likes or comments for the deleted comment, delete them
    Meteor.comments.remove({linkedObjectId:comment._id});
    Meteor.likes.remove({linkedObjectId:comment._id});
});
