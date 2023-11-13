
export function isEmail(val) {
   let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (!regEmail.test(val)) {
      return false
   }else{
      return true
   }
}
export function isPhoneNumber(val) {
   let regEmail = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
   if (!regEmail.test(val)) {
      return false
   }else{
      return true
   }
}

export const validateSignup = (values) => {
   const { firstName, lastName, email, phone,company,phoneCode } = values
   
   if (firstName?.trim() === '' || !/[a-z]/i.test(firstName)) return { data: 'firstName', message: 'Fill valid First Name' }
   if (lastName?.trim() === ''|| !/[a-z]/i.test(lastName)) return { data: 'lastName', message: 'Fill valid Last Name' }
   if (email?.trim() === '') return { data: 'email', message: 'Fill email' }
   if (!isEmail(email)) return { data: 'email', message: 'Please enter valid email' }
   if (phone?.trim() === '') return { data: 'phone', message: 'Fill Phone number' }
   if(!isPhoneNumber(phone))  return { data: 'phone', message: 'Please enter a valid phone number' }
   if (phone?.length < 10 ) return { data: 'phone', message: 'Phone number must be greater than 9 digits' }
   if (company?.trim() === '' || !/[a-z]/i.test(company)) return { data: 'company', message: 'Fill valid company name' }
   if (phoneCode?.trim() === '') return { data: 'phoneCode', message: 'Fill country code' }
   return { data: true, message: 'none' }
}

export const validateOtherDetails = (values) => {
   // console.log(values);
   const { FirstName, LastName, Email, Phone,PphoneCode } = values
   if (FirstName?.trim() === '') return { data: 'FirstName', message: 'Fill First Name' }
   if (LastName?.trim() === '') return { data: 'LastName', message: 'Fill Last Name' }
   if (Email?.trim() === '') return { data: 'Email', message: 'Fill email' }
   if (!isEmail(Email)) return { data: 'Email', message: 'Please enter valid email' }
   if (Phone?.trim() === '') return { data: 'Phone', message: 'Fill Phone number' }
   if (Phone?.length < 10 ) return { data: 'Phone', message: 'Phone number must be greater than 9 digits' }
   if (PphoneCode?.trim() === '') return { data: 'PphoneCode', message: 'Fill country code' }
   return { data: true, message: 'none' }
}