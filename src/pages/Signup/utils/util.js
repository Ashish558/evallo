
function isEmail(val) {
   let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (!regEmail.test(val)) {
      return false
   }else{
      return true
   }
}

export const validateSignup = (values) => {
   const { firstName, lastName, email, phone } = values
   if (firstName.trim() === '') return { data: 'firstName', message: 'Fill First Name' }
   if (lastName.trim() === '') return { data: 'lastName', message: 'Fill Last Name' }
   if (email.trim() === '') return { data: 'email', message: 'Fill email' }
   if (!isEmail(email)) return { data: 'email', message: 'Please enter valid email' }
   if (phone.trim() === '') return { data: 'phone', message: 'Fill Phone number' }
   if (phone.length < 10 ) return { data: 'phone', message: 'Phone number must be greater than 9 digits' }

   return { data: true, message: 'none' }
}

export const validateOtherDetails = (values) => {
   // console.log(values);
   const { FirstName, LastName, Email, Phone } = values
   if (FirstName.trim() === '') return { data: 'FirstName', message: 'Fill First Name' }
   if (LastName.trim() === '') return { data: 'LastName', message: 'Fill Last Name' }
   if (Email.trim() === '') return { data: 'Email', message: 'Fill email' }
   if (!isEmail(Email)) return { data: 'Email', message: 'Please enter valid email' }
   if (Phone.trim() === '') return { data: 'Phone', message: 'Fill Phone number' }
   if (Phone.length < 10 ) return { data: 'Phone', message: 'Phone number must be greater than 9 digits' }

   return { data: true, message: 'none' }
}