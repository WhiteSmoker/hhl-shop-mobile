import { Participant, Stump } from '@/stores/types';
import { Notification } from '@/stores/types/notification.type';
import { orderBy } from 'lodash';

export const sortParticipantByHostHelper = (participant: Participant[]) => {
  const newParticipant = [...participant].sort(first => (first.isHost ? -1 : 1));
  return newParticipant;
};

export const sortNewestStump = (data: Stump[]) => {
  return orderBy(
    data,
    [
      stump => {
        return new Date(stump.createdAt);
      },
    ],
    ['desc'],
  );
};

export const sortNewestNotification = (data: Notification[]) => {
  return orderBy(
    data,
    [
      noti => {
        return new Date(noti.data?.createdAt);
      },
    ],
    ['desc'],
  );
};
