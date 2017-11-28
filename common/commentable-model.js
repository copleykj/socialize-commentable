/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { LinkParent } from 'meteor/socialize:linkable-model';
import SimpleSchema from 'simpl-schema';
import { Comment, CommentsCollection } from './comment-model';


/**
 * CommentableModel - a mixin providing commentable behavior for a model
 */
export const CommentableModel = Base => class extends Base { // eslint-disable-line
    constructor(document) {
        super(document);
        if (!(this instanceof LinkParent)) {
            throw new Meteor.Error('MustExtendParentLink', 'LikeableModel must extend LinkParent from socialize:linkable-model');
        }
    }

    /**
     * Create and link a comment
     * @param {String} body The body text of the comment
     */
    addComment(body) {
        const comment = this.getLinkObject();
        comment.body = body;

        new Comment(comment).save();
    }

    /**
     * Get the comments for a model that is able to be commented on
     * @param  {Object} [options={}] Mongo style options object which is passed to Collection.find()
     * @returns {Mongo.Cursor} A cursor that returns comment instances
     */
    comments(options = {}) {
        return CommentsCollection.find({ linkedObjectId: this._id }, options);
    }
};

// create a schema which can be attached to other commentable types
CommentableModel.CommentableSchema = new SimpleSchema({
    commentCount: {
        type: Number,
        defaultValue: 0,
        custom: SimpleSchema.denyUntrusted,
    },
});
