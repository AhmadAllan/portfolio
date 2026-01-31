import { CommentStatus } from '../common';

export interface IComment {
  id: string;
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string;
  content: string;
  status: CommentStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  parent?: IComment;
  replies?: IComment[];
}
