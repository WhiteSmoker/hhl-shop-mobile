import { Stump } from '@/stores';
import { IStumpData } from '@/stores/types/discovery.type';

export const changeStatusLikeStump = (data: Stump[] | IStumpData[], likedStumpId: any, userId: any) => {
  console.log('asdasdasd', data);
  
  for (const stump of data) {
    if (stump.id === likedStumpId) {
      const index = stump.reactions?.rows.findIndex(e => e.userId === userId);
      if (index !== -1 && index !== undefined) {
        const newUserReaction = {
          ...stump.reactions!.rows[index],
          type: Number(!stump.reactions!.rows[index].type),
        };

        stump.reactions!.rows[index] = newUserReaction;
        break;
      } else {
        stump.reactions!.rows = [...stump.reactions!.rows, ...[{ userId: userId ?? 0, type: 1 }]];
      }
      break;
    }
  }
  return data;
};
// export const changeStatusLikeSearchStump = (data: SearchStump[], likedStump: Stump, userId: any) => {
//   for (const element of data) {
//     for (const stump of element.stumps) {
//       if (stump.id === likedStump?.id) {
//         const index = stump.reactions!.rows.findIndex(e => e.userId === userId?.id);
//         if (index !== -1) {
//           const newUserReaction = {
//             ...stump.reactions!.rows[index],
//             type: Number(!stump.reactions!.rows[index].type),
//           };
//           stump.reactions!.rows[index] = newUserReaction;
//         } else {
//           stump.reactions!.rows = [...stump.reactions!.rows, ...[{ userId: userId?.id ?? 0, type: 1 }]];
//         }
//         break;
//       }
//     }
//   }
//   return data;
// };
