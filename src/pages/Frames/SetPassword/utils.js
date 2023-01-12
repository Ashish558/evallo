

export const validatePassword = (values) => {
   const { password, confirmPassword } = values
   if (password.trim() === '') return { data: 'password', message: 'Password cannot be empty' }
   if (confirmPassword.trim() === '') return { data: 'confirmPassword', message: 'Confirm Password cannot be empty' }
   if (password.length < 8) return { data: 'password', message: 'Password must be greater than 8 characters' }
   if (!/[a-zA-Z]/.test(password)) return { data: 'password', message: 'Password must be contain atleast one letter' }
   if (!/\d/.test(password)) return { data: 'password', message: 'Password must be contain atleast one number' }
   if (password !== confirmPassword) return { data: 'confirmPassword', message: 'Passwords dont match' }
   return { data: true, message: 'none' }
}
