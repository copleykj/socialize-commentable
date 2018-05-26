/* eslint-disable import/no-unresolved */
import Meteor, { Mongo } from '@socialize/react-native-meteor';
import { LinkableModel, LinkParent } from '@socialize/linkable-model';
import { LikeableModel } from '@socialize/likeable';
import { ServerTime } from '@socialize/server-time';
/* eslint-enable imports/no-unresolved */

import CommentConstruct from './common/comment-model.js';

export const { CommentableModel, Comment, CommentsCollection } = CommentConstruct({
    Meteor, Mongo, LinkableModel, LinkParent, LikeableModel, ServerTime,
});
