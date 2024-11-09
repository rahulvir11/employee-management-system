const { z } = require('zod');

// Define allowed image file types

const employeeSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, { message: 'Name cannot be empty' })
    .max(100, { message: 'Name is too long' }),
  
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Email is too short' }),
  
    mobileNo: z
    .string({
      required_error: 'Mobile number is required',
    })
    .refine((value) => /^\d{10}$/.test(value), {
      message: 'Mobile number must be exactly 10 digits',
    }),
  designation: z
    .string({
      required_error: 'Designation is required',
    })
    .min(1, { message: 'Designation cannot be empty' }),
  
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required',
    invalid_type_error: 'Invalid gender',
  }),
  
  course: z
    .string({
      required_error: 'Course is required',
    })
    .min(1, { message: 'Course cannot be empty' }),
});





// Validation function
const employeeFormValidate = async (data) => {
  try {
    
    const validatedData = await employeeSchema.parseAsync(data);
    return { data: validatedData, success: true };
  } catch (err) {
    return { error: err.errors[0].message, success: false };
  }
};

module.exports = employeeFormValidate;
