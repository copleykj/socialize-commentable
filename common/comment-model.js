/**
 * A model for a comment which can be linked to many other database objects
 * @class Comment
 */
Comment = LinkableModel.extendAndSetupCollection("comments");

//extend comment with CommentableModel to make it commentable
_.extend(Comment.prototype, CommentableModel.prototype);

//register Comment as linkable type
LinkableModel.registerLinkableType(Comment, "comment");

/**
 * The user that made the comment
 * @returns {User} A User instance representing the commenting user.
 */
Comment.prototype.user = function () {
    return Meteor.users.findOne(this.userId);
};

//create the CommentsCollection and set a reference to Comment.prototype._collection so BaseModel knows how to find it
CommentsCollection = Comment.collection;

//create the schema
Comment.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert || !this.isFromTrustedCode){
                return Meteor.userId();
            }
        },
        denyUpdate:true
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert || !this.isFromTrustedCode){
                return new Date();
            }
        },
        denyUpdate:true
    },
    "body":{
        type:String
    }
});

Comment.appendSchema(CommentableModel.CommentableSchema);
Comment.appendSchema(LikeableModel.LikeableSchema);
Comment.appendSchema(LinkableModel.LinkableSchema);
