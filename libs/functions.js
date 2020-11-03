export const isValidEmail = (email: string): boolean => {
  const regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(email);
};


export const checkPasswordStrength = (password: String) => {
	if (!password || password.length < 10) {
    return {
      status: false,
      msg: 'Password must have at least 10 chars',
    };
  }
  if (password.length > 50) {
    return {
      status: false,
      msg: 'Password must have max 50 chars',
    }
  }
  let regex = /\d/;
  if (!regex.test(password)) {
    return {
      status: false,
      msg: 'Password must contain at least one number',
    }
  }
  regex = /[a-zA-Z]/;
  if (!regex.test(password)) {
    return {
      status: false,
      msg: 'Password must have contain at least one letter',
    }
  }
  regex = /[\!\@\#\$\%\^\&\*\(\)\_\+]/;
  if (!regex.test(password)) {
    return {
      status: false,
      msg: 'Password must have contain at least one special char (!, @, #, $, %, ^, &, *, (, ), _, + )',
    }
  }
  return { status: true };
}