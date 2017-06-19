# Commentable #

This package enables the creation of models that can be commented on. For example a photo in an photo album could have comments, but also a post to a users feed could as well. Rather than maintaining a photo comments collection and a post comments collection we can implement CommentableModel on our `Post` and `Photo` models and then use it's new methods to store and retrieve comments and information about them, linked to these models.

## Supporting the Project ##
In the spirit of keeping this and all of the packages in the [Socialize](https://atmospherejs.com/socialize) set alive, I ask that if you find this package useful, please donate to it's development.

[Bitcoin](https://www.coinbase.com/checkouts/4a52f56a76e565c552b6ecf118461287) / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)

## Installation ##

```
meteor add socialize:commentable
```

## Basic Usage ##

```javascript
import { Mongo } from 'meteor/mongo';
import { CommentableModel } from 'meteor/socialize-commentable';
import { LinkParent, LinkableModel } from 'meteor/socialize-linkable';
import SimpleSchema from 'simpl-schema';

//define the collection to hold products
const PhotosCollection = new Mongo.Collection("photos");

//define the schema for a product
const PhotosSchema = new SimpleSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                return this.userId;
            }
        },
        denyUpdate:true
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        },
        denyUpdate:true
    }
    //actual schema truncated for brevity
});

//Create a product class extending LikeableModel and LinkParent
class Photo extends CommentableModel(LinkParent) {
    constructor(document){
        super(document);
    }

    //Add any instance(helper) methods here
}

//Attach the collection to the model so we can use BaseModel's CRUD methods
Photo.attachCollection(PhotosCollection);

//Register the Model as a potential Parent of a LinkableModel
LinkableModel.registerParentModel(Photo);


//Create a new product and save it to the database using BaseModel's save method.
new Photo({caption:"Meteor Camp 2016!", cloudinaryId:"sL0Jbf3gBaoeubs3G822WQqwp"}).save();

//Get an instance of Product using a findOne call.
let foundPhoto = PhotosCollection.findOne();

//Post a comment that will be linked to the photo.
foundPhoto.addComment("This was so much fun!");

//Find out how many comments the photo has.
foundPhoto.commentCount(); // -> 1

//Get a cursor of comments for this photo
foundPhoto.comments().forEach((comment) => {
    console.log(`${comment.user().username}: ${comment.body}`);
});
```
