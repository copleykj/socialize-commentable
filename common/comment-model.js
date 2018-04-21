/* eslint-disable import/no-unresolved, no-use-before-define */
import SimpleSchema from 'simpl-schema';
/* eslint-enable import/no-unresolved */

export default ({ Meteor, Mongo, LinkableModel, LinkParent, LikeableModel, ServerTime }) => {
    /**
    * CommentableModel - a mixin providing commentable behavior for a model
    */
    const CommentableModel = Base => class extends Base { // eslint-disable-line
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

    // Collection to store comments
    const CommentsCollection = new Mongo.Collection('socialize:comments');

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
        createdAt: {
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
    class Comment extends CommentableModel(LikeableModel(LinkableModel(LinkParent))) {
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

    return { CommentableModel, Comment, CommentsCollection };
};
