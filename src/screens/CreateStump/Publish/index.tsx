import { IconExit, IconSuccess } from '@/assets/icons/Icon';
import { APP_NAVIGATION, HOME_NAVIGATION, PROFILE_NAVIGATION, RECORD_NAVIGATION, SEARCH_NAVIGATION } from '@/constants';
import { globalLoading } from '@/containers/actions/emitter.action';
import { stumpController } from '@/controllers';
import { conversationController } from '@/controllers/conversation.controller';
import { EDeviceEmitter, emitter } from '@/hooks/useEmitter';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getNumberConversation } from '@/stores/thunks/counter.thunk';
// import { fetchListStumpProfile } from '@/stores/thunks/profile.thunk';
import { commonStyles, ContainerStyled } from '@/styles/common';
import { percentHeight, scale } from '@/theme';
import { Colors } from '@/theme/colors';
import { stringNoNumberSign } from '@/utils/format';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  BackHandler,
  NativeSyntheticEvent,
  Platform,
  Text,
  TextInputKeyPressEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';
import ParticipantPublish from './ParticipantPublish';
import { IProps } from './propState';
import { ApiRoutes } from '@/controllers/api-routes';
import {
  CreateTouchStyled,
  NomarlTextStyled,
  PublishTouchStyled,
  SmallTextStyled,
  styles,
  TextErrorStyled,
  TextInputStyled,
  TextTitleStyled,
  ViewDateTime,
  ViewInputTag,
  ViewStyled,
  ViewTextInputStyled,
} from './styles';
import { cloneDeep } from 'lodash';
import { stumpSlice } from '@/stores/reducers';
import { TextComponent } from '@/containers/components/TextComponent';
type FormData = {
  title: string;
  description: string;
};

const schema = Yup.object().shape({
  title: Yup.string().required('This field is required'),
});

const PublishComponent = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { roomDetail, stoped, postId, matchId, sportId, leagueId, teamId, marketId } = useAppSelector(rootState => ({
    roomDetail: rootState.recordState.roomDetail!,
    stoped: rootState.recordState.stoped,
    postId: rootState.recordState.postId,
    matchId: rootState.recordState.matchId,
    sportId: rootState.recordState.sportId,
    leagueId: rootState.recordState.leagueId,
    teamId: rootState.recordState.teamId,
    marketId: rootState.recordState.marketId,
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ title: string; description: string }>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      title: props.route?.params?.title || '',
      description: props.route?.params?.description || '',
    },
  });

  const [state, setState] = useState<{ hashtags: { text: string; clear: boolean }[] }>({
    hashtags:
      props.route?.params?.tag?.map((tag: any) => {
        return { text: tag, clear: false };
      }) || [],
  });

  const [tagName, setTagName] = useState('');

  const [bottomHeight, setBottomHeight] = useState(0);

  const memoRoomDetail = useMemo(
    () => props.route?.params?.stumpDetail || roomDetail,
    [props.route?.params?.stumpDetail, roomDetail],
  );

  const conversationId = useMemo(() => {
    if (props.route?.params?.mode === 'Edit') {
      return props.route?.params?.stumpDetail?.conversationId;
    }
    return roomDetail?.id;
  }, [props.route?.params?.mode, props.route?.params?.stumpDetail?.conversationId, roomDetail?.id]);

  const ViewDateTimeMemo = useMemo(() => {
    if (props.route?.params?.mode === 'Edit') {
      return;
    }
    if (!roomDetail) {
      return null;
    }
    return (
      <>
        <TextTitleStyled>Date & Time</TextTitleStyled>
        <ViewDateTime>
          <>
            <SmallTextStyled>
              {format(new Date(roomDetail?.scheduledStart), 'eee, MMMM dd yyyy, hh:mm a')}
            </SmallTextStyled>
            <IconSuccess width={scale(20)} height={scale(20)} />
          </>
        </ViewDateTime>
      </>
    );
  }, [props.route?.params?.mode, roomDetail]);

  const goBack = useCallback(() => {
    const screen = props?.route?.params?.stumpDetail?.screen;
    if (!screen) {
      props?.navigation?.goBack();
    }
    switch (screen) {
      case APP_NAVIGATION.HOME:
        props?.navigation?.goBack();
        break;
      case APP_NAVIGATION.SEARCH:
        props?.navigation?.goBack();
        props?.navigation?.navigate(APP_NAVIGATION.SEARCH, { screen: SEARCH_NAVIGATION.SEARCH, initial: false });
        break;
      case APP_NAVIGATION.PROFILE:
        props?.navigation?.goBack();
        props?.navigation?.navigate(APP_NAVIGATION.PROFILE, {
          screen: PROFILE_NAVIGATION.DETAIL_PROFILE,
          initial: false,
        });
        break;
      default:
        break;
    }
  }, [props?.navigation, props?.route?.params?.stumpDetail?.screen]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, []);

  const handleBackPress = React.useCallback(() => {
    const screen = props.route?.params?.screen;
    if (screen === HOME_NAVIGATION.DRAFTHOME) {
      props.navigation.goBack();
      props.navigation.navigate(APP_NAVIGATION.HOME, { screen: HOME_NAVIGATION.DRAFTHOME, initial: false });
      return true;
    }
    return false;
  }, [props.navigation, props.route?.params?.screen]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        const tags = [...new Set(state.hashtags.map(tag => tag.text))];
        globalLoading(true);
        let payload: any = {
          hostId: roomDetail.hostId,
          mode: roomDetail.mode,
          title: data.title,
          description: data.description,
          tag: tags,
          conversationId: roomDetail.id,
        };
        if (postId) {
          payload.postId = postId;
        } else if (matchId) {
          payload.matchId = matchId;
        } else if (sportId) {
          payload.sportId = sportId;
        } else if (leagueId) {
          payload.leagueId = leagueId;
        } else if (teamId) {
          payload.teamId = teamId;
        } else if (marketId) {
          payload.marketId = marketId;
        }
        const res_add_stump = await stumpController.addStump(payload);

        if (res_add_stump.status === 1) {
          //add_stump success
          const stumpId = res_add_stump?.data?.newStump?.id || 0;

          //get detail stump when add success
          const res_detail = await stumpController.getDetailStump(stumpId);
          if (res_detail.status === 1) {
            props.navigation.pop();
            props.navigation.push(RECORD_NAVIGATION.PUBLISH_SUCCESS, {
              newStump: {
                ...res_detail.data[0],
                screen: RECORD_NAVIGATION.PUBLISH_SUCCESS,
              },
              screen: RECORD_NAVIGATION.PUBLISH,
            });

            dispatch(getNumberConversation());
            emitter(EDeviceEmitter.FETCH_DATA_HOME);
            // dispatch(fetchListStumpProfile({ url: ApiRoutes.stump.getListStumpCreated, field: 'created' }));
          }
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [dispatch, props.navigation, roomDetail?.hostId, roomDetail?.id, roomDetail?.mode, state.hashtags],
  );

  const onSubmitEdit = useCallback(
    async (data: FormData) => {
      try {
        const tags = [...new Set(state.hashtags?.map(tag => tag.text))];
        globalLoading(true);
        console.log({ tags });
        const params = {
          title: data.title.trim(),
          description: data.description.trim(),
          listStump: tags,
          id: props.route?.params?.stumpDetail?.id,
        };
        const res_edit_stump = await stumpController.editStump(params);

        if (res_edit_stump.status === 1) {
          dispatch(stumpSlice.actions.setEditStump(params));
          goBack();
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        globalLoading();
      }
    },
    [dispatch, goBack, props.route?.params?.stumpDetail?.id, state.hashtags],
  );

  const _saveDraft = useCallback(async () => {
    try {
      globalLoading(true);
      const tags = [...new Set(state.hashtags.map(tag => tag.text))];
      const title = control._formValues.title || '';
      const description = control._formValues.description || '';
      let dataJson: any = { title, tag: tags, description };
      if (postId) {
        dataJson.postId = postId;
      } else if (matchId) {
        dataJson.matchId = matchId;
      } else if (sportId) {
        dataJson.sportId = sportId;
      } else if (leagueId) {
        dataJson.leagueId = leagueId;
      } else if (teamId) {
        dataJson.teamId = teamId;
      } else if (marketId) {
        dataJson.marketId = marketId;
      }
      const res = await conversationController.updateDraft(memoRoomDetail?.id, JSON.stringify(dataJson));
      if (res.status === 1) {
        props.navigation.popToTop();
        props.navigation.navigate(APP_NAVIGATION.HOME, {
          screen: HOME_NAVIGATION.DRAFTHOME,
          initial: false,
          params: undefined,
        });
        dispatch(getNumberConversation());
        emitter(EDeviceEmitter.FETCH_DATA_DRAFT);
        emitter(EDeviceEmitter.FETCH_DATA_SCHEDULE);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      globalLoading();
    }
  }, [
    control._formValues?.description,
    control._formValues?.title,
    dispatch,
    memoRoomDetail?.id,
    props.navigation,
    state.hashtags,
  ]);

  const handleFocus = (field: 'title' | 'description' | 'tags') => () => {
    if (field === 'title') {
      setBottomHeight(percentHeight(0.42));
    }
    if (field === 'description') {
      setBottomHeight(Platform.OS === 'ios' ? scale(310) : scale(250));
    }
    if (field === 'tags') {
      setBottomHeight(Platform.OS === 'ios' ? scale(190) : scale(150));
    }
  };

  const _onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event && event?.nativeEvent?.key === ',') {
      const tag = _splitSpaceTag(tagName.split(','));
      const oldHashTag = state.hashtags.map(ht => {
        return { ...ht, clear: false };
      });
      const newHashtag = [...oldHashTag, ...tag];

      setState(preState => ({ ...preState, hashtags: newHashtag.filter(item => !!item) }));
      setTimeout(() => {
        setTagName('');
      }, 10);
    }
    if (event.nativeEvent.key === 'Backspace' && !tagName.length) {
      const cloneHashtag = cloneDeep(state.hashtags);
      const lastTag = cloneHashtag?.pop();
      if (!lastTag) {
        return;
      }
      if (!lastTag.clear) {
        const changeLastTag = { ...lastTag, clear: true };
        setState(preState => ({ ...preState, hashtags: [...cloneHashtag, ...[changeLastTag]] }));
      } else {
        setState(preState => ({ ...preState, hashtags: cloneHashtag }));
      }
      setTimeout(() => {
        setTagName('');
      }, 10);
    }
  };

  const _splitSpaceTag = (tag: string[]) => {
    return tag
      .join(' ')
      .split(' ')
      .filter(item => !!item)
      .map(text => {
        return { text: stringNoNumberSign(text), clear: false };
      });
  };

  const _onSubmitEditing = () => {
    const tag = _splitSpaceTag(tagName.split(','));
    const oldHashTag = state.hashtags.map(ht => {
      return { ...ht, clear: false };
    });
    const newHashtag = [...oldHashTag, ...tag];
    setState(preState => ({ ...preState, hashtags: newHashtag.filter(item => !!item) }));
    setTimeout(() => {
      setTagName('');
    }, 10);
  };

  const _deleteTag = (index: number) => () => {
    const newHashTags = state.hashtags.filter((_, i) => i !== index);
    setState(preState => ({ ...preState, hashtags: newHashTags }));
  };

  const onTextChange = (val: string) => {
    setTagName(val);
    // if (val.indexOf(',') >= 0) {
    //   setTagName('');
    // }
  };

  const RenderHashtag = () => {
    return state.hashtags.length ? (
      <ViewInputTag>
        {state.hashtags.map((tag, index) => {
          return (
            <TouchableOpacity key={`${tag}-${index}`} style={styles.tag} onPress={_deleteTag(index)}>
              <View style={[styles.tagView, { backgroundColor: tag.clear ? Colors.Pure_Yellow : Colors.Alto }]}>
                <TextComponent style={styles.textTag}>{`#${tag.text}`}</TextComponent>
                <IconExit width={scale(10)} height={scale(10)} fill={Colors.Black} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ViewInputTag>
    ) : null;
  };

  const ViewButtonMemo = useMemo(() => {
    if (props.route?.params?.mode === 'Edit') {
      return (
        <View>
          <TouchableOpacity style={styles.viewButtonEdit} onPress={handleSubmit(onSubmitEdit)}>
            <NomarlTextStyled>Save</NomarlTextStyled>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.viewButton}>
        <CreateTouchStyled onPress={_saveDraft} backgroundColor={Colors.Dark_Gray1}>
          <NomarlTextStyled>Draft</NomarlTextStyled>
        </CreateTouchStyled>
        <PublishTouchStyled
          onPress={handleSubmit(onSubmit)}
          disabled={!stoped}
          backgroundColor={!stoped ? Colors.greyOpacity : ''}>
          {!stoped ? (
            <ActivityIndicator color={Colors.White} size={scale(20)} style={{ marginRight: scale(8) }} />
          ) : null}
          <NomarlTextStyled>Publish</NomarlTextStyled>
        </PublishTouchStyled>
      </View>
    );
  }, [_saveDraft, handleSubmit, onSubmit, onSubmitEdit, props.route?.params?.mode, stoped]);

  return (
    <ContainerStyled>
      <ViewStyled>
        <KeyboardAwareScrollView
          style={{ width: '100%', height: '100%' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraHeight={bottomHeight}
          enableOnAndroid={true}>
          <Fragment>
            <TextTitleStyled>Speaker</TextTitleStyled>
            <ParticipantPublish conversationId={conversationId || 0} />
            {ViewDateTimeMemo}
            <TextTitleStyled>Title</TextTitleStyled>
            <ViewTextInputStyled style={commonStyles.flatlist_item}>
              <Controller
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputStyled
                    placeholder="Enter your title here"
                    onFocus={handleFocus('title')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="title"
              />
            </ViewTextInputStyled>
            {errors.title && <TextErrorStyled>{errors.title?.message || ''}</TextErrorStyled>}
            <TextTitleStyled>Description</TextTitleStyled>
            <ViewTextInputStyled style={commonStyles.flatlist_item}>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextInputStyled
                    placeholder="Enter your description here"
                    onFocus={handleFocus('description')}
                    onChangeText={onChange}
                    value={value}
                    maxLength={144}
                  />
                )}
                name="description"
              />
            </ViewTextInputStyled>
            <TextTitleStyled>
              Tags <TextTitleStyled fontWeight={'normal'}>(separate with comma)</TextTitleStyled>
            </TextTitleStyled>
            {RenderHashtag()}
            <ViewTextInputStyled style={commonStyles.flatlist_item}>
              <TextInputStyled
                placeholder="Add your tags here"
                onFocus={handleFocus('tags')}
                onChangeText={onTextChange}
                value={tagName}
                onKeyPress={_onKeyPress}
                onSubmitEditing={_onSubmitEditing}
                onBlur={_onSubmitEditing}
              />
            </ViewTextInputStyled>
            {ViewButtonMemo}
          </Fragment>
        </KeyboardAwareScrollView>
      </ViewStyled>
    </ContainerStyled>
  );
};

export default React.memo(PublishComponent);
