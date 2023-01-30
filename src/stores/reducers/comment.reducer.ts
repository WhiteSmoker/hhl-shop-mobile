import unionBy from 'lodash/unionBy';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { validFindIndex } from '@/utils/helper';
import { cloneDeep } from 'lodash';
import { AllCommentSliceState, IComment } from '../types/comment.type';

const initialAllCommentState: AllCommentSliceState = {
  replyComment: undefined,
  likeComment: undefined,
  allComment: [],
  commentLikeReply: undefined,
};
export const commentSlice = createSlice({
  name: 'comment-slice',
  initialState: initialAllCommentState,
  reducers: {
    setAllComment: (state: AllCommentSliceState, action: PayloadAction<IComment[]>) => {
      return {
        ...state,
        allComment: action.payload,
      };
    },
    setLoadMoreComment: (state: AllCommentSliceState, action: PayloadAction<IComment[]>) => {
      return {
        ...state,
        allComment: unionBy([...state.allComment, ...action.payload], 'id'),
      };
    },
    addResReplyComment: (state: AllCommentSliceState, action: PayloadAction<IComment | undefined>) => {
      if (!action.payload) {
        return { ...state };
      }
      const newComments: IComment[] = [...state.allComment];
      if (action.payload.parentId) {
        const idx = newComments.findIndex(comment => comment.id === action.payload?.parentId);
        if (idx !== -1) {
          newComments[idx] = { ...newComments[idx], childs: [...(newComments[idx].childs || []), ...[action.payload]] };
        }
      } else {
        newComments.push(action.payload);
      }
      return {
        ...state,
        allComment: newComments,
      };
    },
    updateResReplyComment: (state: AllCommentSliceState, action: PayloadAction<IComment>) => {
      if (!action.payload) {
        return { ...state };
      }
      if (action.payload.parentId) {
        const cloneAllComment = JSON.parse(JSON.stringify(state.allComment)) as IComment[];
        const idx = state.allComment.findIndex((comment: IComment) => comment.id === action.payload.parentId);
        if (validFindIndex(idx)) {
          const childIdx = cloneAllComment[idx].childs?.findIndex(
            (child: IComment) => child._id === action.payload._id,
          );
          const cloneChilds = cloneDeep(cloneAllComment[idx].childs) || [];
          if (validFindIndex(childIdx)) {
            cloneChilds[childIdx!] = {
              ...action.payload,
              _id: undefined,
              id: action.payload.id,
              content: cloneChilds[childIdx!].content,
            };
            cloneAllComment[idx] = {
              ...cloneAllComment[idx],
              childs: cloneChilds,
            };
            console.log('validFindIndex(childIdx)', childIdx, cloneChilds);
          }
        }
        return { ...state, allComment: cloneAllComment };
      }
      return {
        ...state,
        allComment: state.allComment.map((comment: IComment) => {
          if (comment._id === action.payload._id) {
            return { ...action.payload, _id: undefined, content: comment.content };
          }
          return comment;
        }),
      };
    },
    setReplyComment: (state: AllCommentSliceState, action: PayloadAction<IComment | undefined>) => {
      return {
        ...state,
        replyComment: action.payload,
      };
    },
    setLikeComment: (
      state: AllCommentSliceState,
      action: PayloadAction<{ comment: IComment; totalReact: number; isReacted: boolean }>,
    ) => {
      const newComments: IComment[] = [...state.allComment];
      if (action.payload.comment.parentId) {
        const idxParent = newComments.findIndex(e => e.id === action.payload.comment.parentId);
        if (idxParent !== -1 && newComments[idxParent].childs) {
          const idxChild = (newComments[idxParent].childs || []).findIndex(
            (e: IComment) => e.id === action.payload.comment.id,
          );
          const cloneChilds = [...(newComments[idxParent].childs || [])];
          cloneChilds[idxChild] = {
            ...cloneChilds[idxChild],
            totalReact: action.payload.totalReact,
            isReacted: action.payload.isReacted,
          };
          newComments[idxParent] = {
            ...newComments[idxParent],
            childs: cloneChilds,
          };
        }
      } else {
        const idx = newComments.findIndex(e => e.id === action.payload.comment.id);
        if (idx !== -1) {
          newComments[idx] = {
            ...newComments[idx],
            totalReact: action.payload.totalReact,
            isReacted: action.payload.isReacted,
          };
        }
      }
      return {
        ...state,
        allComment: newComments,
        commentLikeReply: action.payload,
      };
    },
  },
});

export const { setReplyComment, setLikeComment, setAllComment, setLoadMoreComment, updateResReplyComment } =
  commentSlice.actions;
