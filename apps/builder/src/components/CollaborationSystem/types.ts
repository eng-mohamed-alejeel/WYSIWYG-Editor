export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'offline';
  cursor?: {
    x: number;
    y: number;
    componentId?: string;
  };
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  componentId: string;
  content: string;
  timestamp: Date;
  resolved: boolean;
}

export interface CollaborationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}
