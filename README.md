# Commentable

This package enables the creation of models that can be commented on. For example a photo in an photo album could have comments, but also a post to a users feed could as well. Rather than maintaining a photo comments collection and a post comments collection we can implement CommentableModel on our `Post` and `Photo` models and then use it's new methods to store and retrieve comments and information about them, linked to these models.

>>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with clients other than Meteor. For example your server is Meteor, but you want to build a React Native app for the client. This allows you to share code between your Meteor server and other clients to give you a competitive advantage when bringing your mobile and web application to market.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->
- [Supporting The Project](#supporting-the-project)
- [Meteor Installation](#meteor-installation)
- [NPM Installation](#npm-installation)
- [Usage Outside Meteor](#usage-outside-meteor)
  - [React Native](#react-native)
- [Basic Usage](#basic-usage)
- [Scalability - Redis Oplog](#scalability---redis-oplog)
<!-- /TOC -->

## Supporting The Project

Finding the time to maintain FOSS projects can be quite difficult. I am myself responsible for over 30 personal projects across 2 platforms, as well as Multiple others maintained by the [Meteor Community Packages](https://github.com/meteor-community-packages) organization. Therfore, if you appreciate my work, I ask that you either sponsor my work through GitHub, or donate via Paypal or Patreon. Every dollar helps give cause for spending my free time fielding issues, feature requests, pull requests and releasing updates. Info can be found in the "Sponsor this project" section of the [GitHub Repo](https://github.com/copleykj/socialize-commentable)

## Meteor Installation

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
meteor npm install --save simpl-schema
meteor add socialize:commentable
```

## NPM Installation

When using this package with React Native, the dependency tree ensures that `simpl-schema` is loaded so there's no need to install it as when using within Meteor.

```shell
npm install --save @socialize/commentable
```

## Usage Outside Meteor

The client side parts of this package are published to NPM as `@socialize/cloudinary` for use in front ends outside of Meteor.

When using the npm package you'll need to connect to a server, which hosts the server side Meteor code for your app, using `Meteor.connect` as per the [@socialize/react-native-meteor usage example](https://github.com/copleykj/react-native-meteor#example-usage) documentation.

 ```javascript
Meteor.connect('ws://192.168.X.X:3000/websocket');
 ```

### React Native

When using this package with React Native there is some minor setup required by the `@socialize/react-native-meteor` package. See [@socialize/react-native-meteor react-native](https://github.com/copleykj/react-native-meteor#react-native) for necessary instructions.

## Basic Usage

Depending on the environment your code will be running in, you'll need to import the classes from the packages specific to that environment, either Meteor or React Native.

```javascript
//Meteor Imports
import { Mongo } from 'meteor/mongo';
import { CommentableModel } from 'meteor/socialize-commentable';
import { LinkParent, LinkableModel } from 'meteor/socialize-linkable';
```

```javascript
//React Native Imports
import { Mongo } from '@socialize/react-native-meteor';
import { CommentableModel } from '@socialize/commentable';
import { LinkParent, LinkableModel } from '@socialize/linkable';
```

Once we have the appropriate packages imported, the rest of the code will run in either environment.

```javascript
//this gets imported the same for either environment
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
    //methods here
}

//Attach the collection to the model so we can use BaseModel's CRUD methods
Photo.attachCollection(PhotosCollection);

Photo.attachSchema(PhotosSchema);
Photo.attachSchema(CommentableModel.CommentableSchema);

//Register the Model as a potential Parent of a LinkableModel
LinkableModel.registerParentModel(Photo);


//Create a new product and save it to the database using BaseModel's save method.
new Photo({caption:"Meteor Camp 2016!", cloudinaryId:"sL0Jbf3gBaoeubs3G822WQqwp"}).save();

//Get an instance of Product using a findOne call.
let foundPhoto = PhotosCollection.findOne();

//subscribe to the comments for this particular photo
Meteor.subscribe('socialize.commmentsFor', foundPhoto._id);

//Post a comment that will be linked to the photo.
foundPhoto.addComment("This was so much fun!");

//Get a cursor of comments for this photo
foundPhoto.comments().forEach((comment) => {
    console.log(`${comment.user().username}: ${comment.body}`);
});
```

For a more in depth explanation of how to use this package see [API.md](api)

## Scalability - Redis Oplog

This package implements [cultofcoders:redis-oplog][redis-oplog]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][redis-oplog] package and configure it.

[meteor]: https://meteor.com
[redis-oplog]:https://github.com/cultofcoders/redis-oplog
[socialize]: https://atmospherejs.com/socialize
[api]: https://github.com/copleykj/socialize-commentable/blob/master/API.md
