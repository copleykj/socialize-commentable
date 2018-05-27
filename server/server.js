/* eslint-disable import/no-unresolved */
import { LikesCollection } from 'meteor/socialize:likeable';
/* eslint-enable import/no-unresolved */

import { CommentableModel, Comment, CommentsCollection } from '../common/common.js';
import './publications.js';

CommentsCollection.allow({
    insert(userId, comment) {
        return userId && comment.checkOwnership();
    },
    remove(userId, comment) {
        return userId && comment.checkOwnership();
    },
});

CommentsCollection.after.insert(function afterInsert(userId, comment) {
    // when a comment is added, update the comment count for the object being commented on
    const collection = this.transform().getCollectionForParentLink();
    collection && collection.update({ _id: comment.linkedObjectId }, { $inc: { commentCount: 1 } });
});

CommentsCollection.after.remove(function afterRemove(userId, comment) {
    // when a comment is deleted, update the comment count for the object being commented on
    const collection = this.transform().getCollectionForParentLink();
    collection && collection.update({ _id: comment.linkedObjectId }, { $inc: { commentCount: -1 } });

    // if there are any likes or comments for the deleted comment, delete them
    CommentsCollection.remove({ linkedObjectId: comment._id });
    LikesCollection.remove({ linkedObjectId: comment._id });
});

export { CommentableModel, Comment, CommentsCollection };
