const buttonPressDebounce = 500; // used only once
let debounce: any;
let lastId: any;

export const debouncePress = (id: any, callback: () => void, delay = buttonPressDebounce) => {
  if (debounce) {
    return false;
  }
  debounce = Date.now();

  callback();
  debounce = setTimeout(() => {
    debounce = null;
    lastId = id;
  }, delay);
};

export const delay = (time: number) => {
  return new Promise(resolve => setTimeout(() => resolve(true), time));
};
