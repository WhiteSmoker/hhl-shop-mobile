import { commonStyles } from '@/styles/common';
import { Colors } from '@/theme/colors';
import { stringToSlug } from '@/utils/format';
import { requestContactPermission } from '@/utils/permission';
import React, { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TextInputFocusEventData,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import { scale } from 'react-native-size-scaling';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import { cloneDeep } from 'lodash';
import { TextComponent } from '@/containers/components/TextComponent';

export interface Contact {
  id?: number;
  section?: boolean;
  displayName: string;
  phoneNumbers: { label: string; number: string }[];
}

interface Props {
  onChooseContact(phoneNumber: string): void;
}

interface IContactRefs {
  open: () => void;
  close: () => void;
}

const ContactComponent = memo(
  forwardRef<IContactRefs, Props>((props, ref) => {
    const HEIGHT_MODAL = Dimensions.get('window').height;
    const slideYAnim = React.useRef(new Animated.Value(HEIGHT_MODAL)).current;
    const transtaleXValue = React.useRef(new Animated.Value(scale(200))).current;
    const [modalPhoneNumber, setPhoneNumber] = useState<{ label: string; number: string }[]>([]);
    const [filterContact, setFilterContact] = useState<Contact[] | undefined>([]);
    const [stickyIndices, setStickyIndices] = useState<number[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const { control, setValue } = useForm<{ search: string }>();

    useEffect(() => {
      _getAllContact();
      return () => {
        setOpenModal(false);
      };
    }, []);

    useEffect(() => {
      setFilterContact(undefined);
    }, []);

    const _getAllContact = async () => {
      try {
        const permission = await requestContactPermission();
        if (permission) {
          const allContact = await Contacts.getAll();
          const newContacts = allContact.map(contact => ({
            section: false,
            displayName:
              Platform.OS === 'android'
                ? contact.displayName ?? ''
                : contact.givenName + ' ' + contact.middleName + ' ' + contact.familyName,
            phoneNumbers: contact.phoneNumbers.map(phone => ({ ...phone, number: phone.number.split(' ').join('') })),
          }));
          const newArr = formatSectionList(newContacts.sort((a, b) => a.displayName?.localeCompare(b.displayName)));
          setContacts(newArr);
        }
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      if (openModal) {
        _aniSlideY();
      }
    }, [openModal]);

    const _aniSlideY = () => {
      return new Promise<boolean>(resolve => {
        Animated.timing(slideYAnim, {
          toValue: 0,
          useNativeDriver: true,
          duration: 250,
        }).start(endCallback => {
          if (endCallback.finished) {
            resolve(true);
          }
        });
      });
    };

    const _aniOffSlideY = () => {
      return new Promise<boolean>(resolve => {
        Animated.timing(slideYAnim, {
          toValue: HEIGHT_MODAL,
          useNativeDriver: true,
          duration: 250,
        }).start(endCallback => {
          if (endCallback.finished) {
            resolve(true);
          }
        });
      });
    };

    const offModalPhoneNumber = () => {
      setPhoneNumber([]);
    };

    const onFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      event.persist();
      Animated.timing(transtaleXValue, {
        toValue: 0,
        useNativeDriver: true,
        duration: 100,
      }).start();
    };
    const onBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      event.persist();
      if (control._formValues?.inviteCode) {
        return;
      }
      Animated.timing(transtaleXValue, {
        toValue: scale(200),
        useNativeDriver: true,
        duration: 100,
      }).start();
    };

    const _closeModal = async () => {
      await _aniOffSlideY();
      setOpenModal(false);
    };

    const formatSectionList = React.useMemo(
      () => (data: Contact[]) => {
        const contactsArr = [] as Contact[];
        const aCode = 'A'.charCodeAt(0);
        for (let i = 0; i < 26; i++) {
          const currChar = String.fromCharCode(aCode + i);

          const objSection: Contact = {
            section: true,
            displayName: currChar,
            phoneNumbers: [],
          };

          const currContacts = data.filter(item => {
            return item.displayName[0]?.toUpperCase() === currChar;
          });
          if (currContacts.length > 0) {
            contactsArr.push(...[...[objSection], ...currContacts]);
          }
        }
        const other0bj: Contact = {
          section: true,
          displayName: '#',
          phoneNumbers: [],
        };
        const currOtherContacts = data.filter(item => {
          return item.displayName[0]?.toUpperCase() === item.displayName[0]?.toLowerCase();
        });
        if (currOtherContacts.length > 0) {
          contactsArr.push(...[...[other0bj], ...currOtherContacts]);
        }
        //sticky indices

        const stickyIndiceArr: number[] = [];
        contactsArr.forEach((contact, index) => {
          if (contact.section) {
            stickyIndiceArr.push(index);
          }
        });
        setStickyIndices(stickyIndiceArr);
        return [...contactsArr.map((item, index) => ({ ...item, id: index }))];
      },
      [],
    );

    const _chooseContact = (phoneNumbers: { label: string; number: string }[]) => async () => {
      if (phoneNumbers.length > 1) {
        setPhoneNumber(phoneNumbers);
        return;
      }
      if (phoneNumbers.length && phoneNumbers[0]?.number) {
        props.onChooseContact(phoneNumbers[0]?.number);
      }
      setPhoneNumber([]);
      await _closeModal();
    };

    //search follower
    const _onSearch = (_searchVal: string) => {
      try {
        if (_searchVal.trim() === '') {
          setFilterContact(undefined);
          return;
        }
        const newData = cloneDeep(contacts);

        const result = newData
          ?.filter(e => !e.section)
          .filter(item => {
            const matchingDisplayName = stringToSlug(item.displayName).includes(stringToSlug(_searchVal));

            return matchingDisplayName;
          });
        setFilterContact(formatSectionList(result));
      } catch (error: any) {
        console.log(error);
      }
    };

    const _onSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      e.persist();
      const text = control?._formValues?.search.trim();
      _onSearch(text);
    };

    const _clearFieldSearch = () => {
      const text = control?._formValues?.search;
      if (text) {
        setValue('search', '');
        setFilterContact(undefined);
      }
    };

    // eslint-disable-next-line react/display-name
    const renderItem = React.useMemo(
      () =>
        ({ item }: { item: Contact }) => {
          return (
            <TouchableOpacity
              style={[item?.section ? styles.sectionHeader : styles.rowSectionItem]}
              onPress={_chooseContact(item.phoneNumbers)}
              disabled={!!item?.section}>
              <TextComponent style={styles.textDisplayName}>{item.displayName}</TextComponent>
              {item.phoneNumbers.map((phone, i) => {
                return (
                  <View key={i}>
                    <TextComponent style={styles.textPhoneNumber}>
                      {phone.label}: {phone.number}
                    </TextComponent>
                  </View>
                );
              })}
            </TouchableOpacity>
          );
        },
      [],
    );

    const stylesFlatlist = useMemo(() => [commonStyles.flex_1, { width: '100%' }], []);

    const keyExtractor = useMemo(() => (item: any) => item.id?.toString(), []);

    const memoizedStickyIndices = useMemo(() => stickyIndices, [stickyIndices]);
    const memoizedData = useMemo(() => filterContact || contacts, [filterContact, contacts]);

    useImperativeHandle(
      ref,
      () => {
        return {
          open: () => {
            setOpenModal(true);
          },
          close: () => {
            setOpenModal(false);
          },
        };
      },
      [],
    );

    return openModal ? (
      <Animated.View style={[styles.aniViewContact, { transform: [{ translateY: slideYAnim }] }]}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {modalPhoneNumber.length ? (
              <TouchableOpacity style={styles.modalPhoneNumber} onPress={offModalPhoneNumber} activeOpacity={1}>
                <View style={[commonStyles.flatlist_item, styles.phoneItem]}>
                  {modalPhoneNumber.map((element, index) => {
                    return (
                      <TouchableOpacity onPress={_chooseContact([element])} key={index} style={styles.rowSectionItem}>
                        <TextComponent style={styles.textPhoneNumber}>{element.number}</TextComponent>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableOpacity>
            ) : null}
            <View style={styles.viewInput}>
              <View style={styles.viewSearch}>
                <Icon name="search-outline" size={scale(20)} color={Colors.Gray} />

                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SearchTextInputStyled
                      placeholder="Search"
                      onChangeText={onChange}
                      value={value}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      onSubmitEditing={_onSubmit}
                    />
                  )}
                  name="search"
                  defaultValue={''}
                />
                <Animated.View style={[styles.viewJoin, { transform: [{ translateX: transtaleXValue }] }]}>
                  <TouchableOpacity onPress={_clearFieldSearch}>
                    <Icon name="close-outline" size={scale(22)} color={Colors.Gray} />
                  </TouchableOpacity>
                </Animated.View>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={_closeModal}>
                <TextComponent style={styles.textDone}>Done</TextComponent>
              </TouchableOpacity>
            </View>

            <FlatList
              data={memoizedData}
              extraData={memoizedData}
              style={stylesFlatlist}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              stickyHeaderIndices={memoizedStickyIndices}
            />
          </View>
        </View>
      </Animated.View>
    ) : (
      <></>
    );
  }),
);

export default ContactComponent;

const SearchTextInputStyled = styled.TextInput`
  font-style: normal;
  font-family: Lexend-Bold;
  font-size: ${scale(14)}px;
  align-items: center;
  color: ${Colors.dark};
  padding: ${scale(Platform.OS === 'ios' ? 10 : 3)}px;
  flex: 1;
`;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  aniViewContact: {
    position: 'absolute',
    zIndex: 3,
    width: '100%',
    height: '100%',
    bottom: 0,
    flex: 1,
  },
  containerSection: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: scale(20),
  },
  sectionHeader: {
    backgroundColor: '#efefef',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
  },
  rowSectionItem: {
    backgroundColor: '#fff',
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
    borderBottomWidth: scale(1),
    borderBottomColor: Colors.Very_Light_Gray,
  },
  modalView: {
    backgroundColor: Colors.White,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDisplayName: {
    textTransform: 'capitalize',
    fontSize: scale(16),
    marginTop: scale(5),
    fontFamily: 'Lexend-Bold',
  },
  textDone: {
    textTransform: 'capitalize',
    fontSize: scale(16),
    fontFamily: 'Lexend-Bold',
    color: Colors.Soft_Blue,
  },
  textPhoneNumber: {
    textTransform: 'capitalize',
    fontSize: scale(13),
  },
  sign: {
    alignSelf: 'flex-end',
    padding: scale(5),
  },
  viewInput: {
    flexDirection: 'row',
    padding: scale(8),
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.White,
  },
  viewSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    paddingHorizontal: scale(12),
    paddingVertical: scale(3),
    backgroundColor: Colors.Very_Light_Gray,
    borderRadius: scale(10),
  },
  viewJoin: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.Very_Light_Gray,
  },
  modalPhoneNumber: {
    position: 'absolute',
    flex: 1,
    zIndex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.greyOpacity,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneItem: { backgroundColor: 'white', padding: scale(10) },
});
