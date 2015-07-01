/**
 * A scaffold for creating models which can have comments attached to them
 * @class CommentableModel
 */
CommentableModel = LikeableModel.extend();

/**
 * Create and link a comment
 * @param {String} body The body text of the comment
 */
CommentableModel.prototype.addComment = function (body) {
    var type = this._objectType;
    new Comment().save({body:body, linkedObjectId:this._id, objectType:type});
};

/**
 * Get the comments for a model that is able to be commented on
 * @param   {Number}       limit     The maximum number of records to return
 * @param   {Number}       skip      The number of records to skip
 * @param   {String}       sortBy    The field on which to sort
 * @param   {Number}       sortOrder The order in which to sort. 1 for ascending and -1 for descending
 * @returns {Mongo.Cursor} A cursor that returns comment instances
 */
CommentableModel.prototype.comments = function(limit, skip, sortBy, sortOrder){
    var options = {};

    if (limit) {
        options.limit = limit;
    }

    if (skip) {
        options.skip = skip;
    }

    if(sortBy && sortOrder){
        options.sort = {};
        options.sort[sortBy] = sortOrder;
    }

    return CommentsCollection.find({linkedObjectId:this._id}, options);
};

/**
 * The number of comments on the commentable object
 * @returns {Number} The number of comments
 */
CommentableModel.prototype.commentCount = function(){
    //Necessary  for backwards compatibility with old comments
    return _.isArray(this._commentCount) ? this._commentCount.length : this._commentCount || 0;
};

//create a schema which can be attached to other commentable types
CommentableModel.CommentableSchema = new SimpleSchema({
    "_commentCount":{
        type:Number,
        defaultValue:0
    }
});
