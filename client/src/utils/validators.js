export const validators = {
    required: (value) => {
      if (!value) return 'This field is required';
      return '';
    },
  
    email: (value) => {
      if (!value) return '';
      
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(value)) return 'Please enter a valid email address';
      
      return '';
    },
  
    password: (value) => {
      if (!value) return '';
      
      if (value.length < 8) return 'Password must be at least 8 characters';
      
      if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
      
      if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
      
      if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
      
      return '';
    },
  
    confirmPassword: (value, passwordValue) => {
      if (!value) return '';
      
      if (value !== passwordValue) return 'Passwords do not match';
      
      return '';
    },
  
    username: (value) => {
      if (!value) return '';
      
      if (value.length < 3) return 'Username must be at least 3 characters';
      
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return 'Username can only contain letters, numbers, and underscores';
      }
      
      return '';
    },
  
    validateForm: (values, validationRules) => {
      const errors = {};
      let isValid = true;
      
      Object.keys(validationRules).forEach(field => {
        const value = values[field];
        const validations = validationRules[field];
        
        validations.forEach(validation => {
          // Skip validation if field is empty and not required
          if (!value && validation.name !== 'required') return;
          
          const errorMessage = validation.validator(value, values[validation.compareWith]);
          
          if (errorMessage) {
            errors[field] = errorMessage;
            isValid = false;
          }
        });
      });
      
      return { isValid, errors };
    }
  };