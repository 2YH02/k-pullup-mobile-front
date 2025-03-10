export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  const hasLetterAndNumber = /(?=.*[A-Za-z])(?=.*\d)/.test(password);

  const isLongEnough = password.length >= 8;

  return { hasLetterAndNumber, isLongEnough };
};

export const validateCode = (code: string) => {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
};

export const validateNumeric = (number: string) => {
  const numberRegex = /^\d*$/;
  return numberRegex.test(number);
};

interface SigninValue {
  email: string;
  password: string;
}

export const validateMassage = {
  email: "이메일 형식을 확인해주세요",
  password: "하나 이상의 숫자와 문자를 포함하여 8자 이상으로 작성해주세요.",
  emailCode: "입력한 코드를 다시 확인해주세요.",
};

export const validateSigin = (formValue: SigninValue) => {
  const errors: Partial<SigninValue> = {};

  if (!validateEmail(formValue.email)) {
    errors.email = validateMassage.email;
  }

  const { hasLetterAndNumber, isLongEnough } = validatePassword(
    formValue.password
  );

  if (!hasLetterAndNumber || !isLongEnough) {
    errors.password = validateMassage.password;
  }

  return errors;
};
