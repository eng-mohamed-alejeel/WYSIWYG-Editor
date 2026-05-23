import React, { useState } from 'react';
import { Panel } from '@wysiwyg/ui';
import { Tabs, TabItem } from '@wysiwyg/ui';
import { User, Comment, CollaborationSystemProps } from './CollaborationSystem/types';
import { UsersTab } from './CollaborationSystem/UsersTab';
import { CommentsTab } from './CollaborationSystem/CommentsTab';
import { ActivityTab } from './CollaborationSystem/ActivityTab';
import { InviteModal } from './CollaborationSystem/InviteModal';

export const CollaborationSystem: React.FC<CollaborationSystemProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://via.placeholder.com/32',
      role: 'owner',
      status: 'online',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://via.placeholder.com/32',
      role: 'editor',
      status: 'online',
    },
  ]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [newComment, setNewComment] = useState('');

  const handleInviteUser = () => {
    if (!inviteEmail.trim()) return;
    setUsers([
      ...users,
      {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        avatar: `https://via.placeholder.com/32`,
        role: inviteRole,
        status: 'offline',
      },
    ]);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const handleRemoveUser = (userId: string) => setUsers(users.filter((user) => user.id !== userId));

  const handleUpdateRole = (userId: string, newRole: 'editor' | 'viewer') =>
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        userId: '1',
        userName: 'John Doe',
        componentId: 'selected-component',
        content: newComment,
        timestamp: new Date(),
        resolved: false,
      },
    ]);
    setNewComment('');
  };

  const handleResolveComment = (commentId: string) =>
    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, resolved: true } : comment
      )
    );

  const handleDeleteComment = (commentId: string) =>
    setComments(comments.filter((comment) => comment.id !== commentId));

  const tabs: TabItem[] = [
    {
      id: 'users',
      label: 'Users',
      content: (
        <UsersTab
          users={users}
          onInviteClick={() => setIsInviteModalOpen(true)}
          onUpdateRole={handleUpdateRole}
          onRemoveUser={handleRemoveUser}
        />
      ),
    },
    {
      id: 'comments',
      label: 'Comments',
      content: (
        <CommentsTab
          comments={comments}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={handleAddComment}
          onResolveComment={handleResolveComment}
          onDeleteComment={handleDeleteComment}
        />
      ),
    },
    { id: 'activity', label: 'Activity', content: <ActivityTab /> },
  ];

  return (
    <>
      <Panel
        isOpen={isOpen}
        onClose={onClose}
        position="right"
        size="medium"
        title="Collaboration"
        className="h-full"
      >
        <Tabs
          items={tabs}
          defaultActiveTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
          className="flex-1"
        />
      </Panel>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        inviteEmail={inviteEmail}
        onEmailChange={setInviteEmail}
        inviteRole={inviteRole}
        onRoleChange={setInviteRole}
        onInvite={handleInviteUser}
      />
    </>
  );
};

export default CollaborationSystem;
