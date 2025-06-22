interface CommentClient {
  id: string;
  authorName: string;
  authorId: string;
  authorAvatar: string;
  createdAt: string;
  content: string;
  replyCount: number;
}

 interface CommentClientResponse {
  result: CommentClient[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  status: number;
  message: string;
}
