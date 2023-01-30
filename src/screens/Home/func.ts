import { Conversation } from '@/stores/types/record.type';
import { format } from 'date-fns';
import orderBy from 'lodash/orderBy';

export const formatConversationDataByTime = (data: Conversation[]) => {
  try {
    const newList = data.map(list => {
      return { ...list, group: format(new Date(list?.scheduledStart), 'EEEE, LLLL dd, yyyy') };
    });

    //sort list by date
    const sortList = orderBy(
      newList,
      [
        list => {
          return list?.scheduledStart;
        },
      ],
      ['asc'],
    );
    const arrayHashmap = sortList.reduce((obj, item) => {
      //convert common date
      if (obj[item.group]) {
        obj[item.group] = { ...obj[item.group], data: [...obj[item.group].data, ...[item]] };
      } else {
        obj[item.group] = { header: item.group, data: [item] };
      }
      return obj;
    }, {} as { [key: string]: { header: string; data: Conversation[] } });
    return Object.values(arrayHashmap);
  } catch (error: any) {
    console.log(error);
  }
};
