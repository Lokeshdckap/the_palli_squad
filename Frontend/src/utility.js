const content = [
    {
      error: false,
      content: 'At least one special character is required',
      key: 'specialCharError'
    },
    {
      error: false,
      content: 'At least one lowercase letter is required',
      key: 'lowercaseError'
    },
    {
      error: false,
      content: 'At least one uppercase letter is required', 
      key: 'uppercaseError' 
    },
    {
      error: false,
      content: 'At least one number is required',
      key: 'numberError'
    },
    {
      error: false,
      content: 'Password should be at least 8 characters long',
      key: 'lengthError'
    }
  ];
  
  export const trackPwdRequirement = (password) => {
    let specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~]/;
    let lowercaseRegex = /[a-z]/;
    let uppercaseRegex = /[A-Z]/; 
    let numberRegex = /\d/;
    
    let updatedContent = content.map((item) => {
       switch (item.key) {
         case "specialCharError":
           item.error = !specialCharRegex.test(password);
           break;
         case "lowercaseError":
           item.error = !lowercaseRegex.test(password);
           break;
         case "uppercaseError":
           item.error = !uppercaseRegex.test(password);
           break;
         case "numberError":
           item.error = !numberRegex.test(password);
           break;
         case "lengthError":
           item.error = password.length < 8;
           break;
         default:
           break;
       }
       return item;
     });
  
    return updatedContent;
  };