/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { LinkableModel, LinkParent } from 'meteor/socialize:linkable-model';
import { LikeableModel } from 'meteor/socialize:likeable';
import { ServerTime } from 'meteor/socialize:server-time';
import { CommentableModel } from './commentable-model';

// Collection to store comments
export const CommentsCollection = new Mongo.Collection('socialize:comments');

if (CommentsCollection.configureRedisOplog) {
    CommentsCollection.configureRedisOplog({
        mutation(options, { selector, doc }) {
            let linkedObjectId = (selector && selector.linkedObjectId) || (doc && doc.linkedObjectId);

            if (!linkedObjectId && selector._id) {
                const comment = CommentsCollection.findOne({ _id: selector._id }, { fields: { linkedObjectId: 1 } });
                linkedObjectId = comment && comment.linkedObjectId;
            }

            if (linkedObjectId) {
                Object.assign(options, {
                    namespace: linkedObjectId,
                });
            }
        },
        cursor(options, selector) {
            if (selector.linkedObjectId) {
                Object.assign(options, {
                    namespace: selector.linkedObjectId,
                });
            }
        },
    });
}

// Create the schema for the comment
const CommentSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert) {
                return Meteor.userId();
            }
            return undefined;
        },
        denyUpdate: true,
    },
    createAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return ServerTime.date();
            }
            return undefined;
        },
        index: -1,
        denyUpdate: true,
    },
    // Latest update date
    updatedAt: {
        type: Date,
        optional: true,
        autoValue() {
            return ServerTime.date();
        },
    },
    body: {
        type: SimpleSchema.oneOf(String, Object),
    },
});

/**
 * A model for a comment which can be linked to many other database objects
 * @class Comment
 * @extends ParentLink
 * @implements CommentableModel, LikeableModel, LinkableModel
 */
export class Comment extends CommentableModel(LikeableModel(LinkableModel(LinkParent))) {
    /**
     * The user that made the comment
     * @returns {User} A User instance representing the commenting user.
     */
    user() {
        return Meteor.users.findOne({ _id: this.userId });
    }
}

// attach the schema
CommentsCollection.attachSchema(CommentSchema);

// attach the CommentsCollection to the Comment class so we can use BaseModel's CRUD methods
Comment.attachCollection(CommentsCollection);

// add fields to schema required by LinkableModel
Comment.appendSchema(LinkableModel.LinkableSchema);
// add fields to schema required by CommentableModel
Comment.appendSchema(CommentableModel.CommentableSchema);
// add fields to schema required by LikeableModel
Comment.appendSchema(LikeableModel.LikeableSchema);

LinkableModel.registerParentModel(Comment);
