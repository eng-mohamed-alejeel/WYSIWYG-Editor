import React from 'react';
import { Button } from '@wysiwyg/ui';
import { Icon } from '@wysiwyg/ui';
import { Input } from '@wysiwyg/ui';
import { Comment } from './types';

interface CommentsTabProps {
  comments: Comment[];
  newComment: string;
  onCommentChange: (value: string) => void;
  onAddComment: () => void;
  onResolveComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({
  comments,
  newComment,
  onCommentChange,
  onAddComment,
  onResolveComment,
  onDeleteComment,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button variant="primary" size="small" onClick={onAddComment} disabled={!newComment.trim()}>
          <Icon name="send" size="small" />
        </Button>
      </div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 border rounded-lg ${comment.resolved ? 'opacity-50' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.userName}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(comment.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-1">
                  {!comment.resolved && (
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onResolveComment(comment.id)}
                    >
                      <Icon name="check" size="small" />
                    </Button>
                  )}
                  <Button variant="ghost" size="small" onClick={() => onDeleteComment(comment.id)}>
                    <Icon name="delete" size="small" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
              {comment.resolved && <div className="mt-2 text-sm text-green-600">✓ Resolved</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
