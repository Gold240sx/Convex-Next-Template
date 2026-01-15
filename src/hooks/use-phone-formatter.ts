export const usePhoneFormatter = (inputValue: string) => {
  if (!inputValue) return inputValue;
  const sanitizedValue = inputValue.replace(/[^\d]/g, "");
  let formattedValue = "";
  if (sanitizedValue.length <= 3) {
    formattedValue = sanitizedValue;
  } else if (sanitizedValue.length <= 6) {
    formattedValue = `(${sanitizedValue.slice(0, 3)}) ${sanitizedValue.slice(3)}`;
  } else {
    formattedValue = `(${sanitizedValue.slice(0, 3)}) ${sanitizedValue.slice(3, 6)}-${sanitizedValue.slice(6, 10)}`;
  }
  return formattedValue;
};
