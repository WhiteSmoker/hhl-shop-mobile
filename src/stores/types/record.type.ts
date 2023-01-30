import { File, Participant } from '.';

export interface Conversation {
  id: number;
  hostId: number;
  mode: number;
  scheduledStart: Date | string;
  message: string;
  agoraResourceId?: any;
  agoraSid?: any;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  participants: Participant[];
  files: File[];
  duration: number;
  draft: string;
  scheduleMode: number;
  stumpId: number;
  isMissed: boolean;
}
