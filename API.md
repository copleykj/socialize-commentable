## CommentableModel ##

CommentableModel is used to add commenting capabilities to a model that is built on Socialize's `BaseModel` class. To make a model commentable you just need to extend CommentableModel and pass in the LinkParent class in a mixin pattern.

```javascript
class Thing extends CommentableModel(LinkParent){
    //instance methods here
}
```

This pattern is useful when you want to implement several behaviors such as Commentable and Likeable

```javascript
class Thing extends CommentableModel(LikeableModel(LinkParent)){
    //instance methods here
}
```

### Instance Methods ###

**addComment(body)** - create a comment that is linked to this instance of a model.

**comments(options)** - returns a cursor of comments that are linked to this instance of a model. Signature of `options` param is the same as you would pass to `Collection.find()`.


## Comment  - Extends [LinkableModel](https://github.com/copleykj/socialize-linkable-model) - Implements [CommentableModel](https://github.com/copleykj/socialize-commentable), [LikeableModel](https://github.com/copleykj/socialize-likeable)##

A comment is a record of a user commenting on an instance of a model with a reference to that instance. The `Comment` model also implements `CommentableModel` and `LikeableModel` so that comments can be liked as well as commented on. If you choose to use the package in this fashion, be careful how far you allow the nesting of comments.

### Instance Methods ###

**user()** - Returns an instance of the user that made the comment.

## Publications ##

**socialize.commentsFor(linkedObjectId, publicComments = true, options = { limit: 10, sort: { createdAt: -1 } })** - Publishes the comments and their related data for a certain object.

```javascript
Meteor.subscribe('socialize.commentsFor', post._id, false, { limit: 5, skip: 2 });
```

`publicComments` allows to hide or display comments to anonymous users.
