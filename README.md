# Commentable #

A package enabling the creation of models that can be commented on. For example a photo in an photo album could have comments, but also a post to a users feed could as well. Rather than maintaining a photo comments collection and a post comments collection separately, we can have one collection and store linking information.

## CommentableModel - Extends LikeableModel ##

**CommentableModel.prototype.addComment(body)** - create a comment that is linked this commentable object.

**CommentableModel.prototype.comments = function(limit, skip, sortBy, sortOrder)** - get the comments for this commentable object.

**CommentableModel.prototype.commentCount()** - get the number of comments for a particular commentable object.

## Comment ## - Extends LinkableModel, CommentableModel, LikeableModel ##

**Comment.prototype.user()** - Get an instance of the user that made the comment
