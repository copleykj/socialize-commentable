/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { LinkableModel, LinkParent } from 'meteor/socialize:linkable-model';
import { LikeableModel } from 'meteor/socialize:likeable';
import { ServerTime } from 'meteor/socialize:server-time';
/* eslint-enable imports/no-unresolved */

import CommentConstruct from './comment-model.js';

export const { CommentableModel, Comment, CommentsCollection } = CommentConstruct({
    Meteor, Mongo, LinkableModel, LinkParent, LikeableModel, ServerTime,
});
