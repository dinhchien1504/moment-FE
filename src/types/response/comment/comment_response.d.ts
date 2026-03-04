interface CommentClient {
  id: number;
  authorName: string;
  authorId: string;
  authorAvatar: string;
  createdAt: string;
  content: string;
  replyCount: number;
  path?: number[];
  replies?: CommentClient[];
}

 interface CommentClientResponse {
  result: CommentClient[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  status: number;
  message: string;
}
