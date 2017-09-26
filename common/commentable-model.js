/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
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

        new Comment(comment).save({
            channel: `comments::${this._id}`,
        });
    }

    /**
     * Get the comments for a model that is able to be commented on
     * @param  {Object} [options={}] Mongo style options object which is passed to Collection.find()
     * @returns {Mongo.Cursor} A cursor that returns comment instances
     */
    comments(options = {}) {
        const newOptions = {
            ...options,
            channel: `comments::${this._id}`,
        };
        return CommentsCollection.find({ linkedObjectId: this._id }, newOptions);
    }

    /**
     * The number of comments on the commentable object
     * @returns {Number} The number of comments
     */
    commentCount() {
        // Necessary  for backwards compatibility with old comments
        return _.isArray(this._commentCount) ? this._commentCount.length : this._commentCount || 0;
    }
};

// create a schema which can be attached to other commentable types
CommentableModel.CommentableSchema = new SimpleSchema({
    _commentCount: {
        type: Number,
        defaultValue: 0,
        custom: SimpleSchema.denyUntrusted,
    },
});
