/**
 * Age and Booking Input Validator Middleware
 *
 * Rules:
 * - Customer inputs: fullName, phoneNumber, age
 * - phoneNumber must match Uzbekistan pattern: ^\+998\d{9}$
 * - age >= 12. If age < 12, throw validation error: "Minimum allowable age is 12 years old."
 */

export const validateBookingInput = (req, res, next) => {
  const { customerName, fullName, customerPhone, phoneNumber, customerAge, age } = req.body;

  const finalName = (customerName || fullName || '').trim();
  const rawPhone = (customerPhone || phoneNumber || '').trim();
  const rawAge = customerAge !== undefined ? customerAge : age;

  // 1. Full name validation
  if (!finalName || finalName.length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Iltimos, toʻliq ism-sharifingizni kiriting (kamida 2 ta belgi).',
      code: 'INVALID_NAME',
    });
  }

  // 2. Phone number validation (Uzbekistan format: ^\+998\d{9}$)
  const uzbPhoneRegex = /^\+998\d{9}$/;
  // Clean spaces/hyphens if any
  const normalizedPhone = rawPhone.replace(/[\s\-()]/g, '');

  if (!uzbPhoneRegex.test(normalizedPhone)) {
    return res.status(400).json({
      success: false,
      error: 'Telefon raqam formati notoʻgʻri. Oʻzbekiston formati boʻlishi shart (+998901234567).',
      code: 'INVALID_PHONE_NUMBER',
    });
  }

  // 3. Age validation rule: age >= 12
  const parsedAge = parseInt(rawAge, 10);
  if (isNaN(parsedAge)) {
    return res.status(400).json({
      success: false,
      error: 'Yoshingizni raqamda kiriting.',
      code: 'INVALID_AGE_FORMAT',
    });
  }

  if (parsedAge < 12) {
    return res.status(400).json({
      success: false,
      error: 'Minimum allowable age is 12 years old.',
      code: 'AGE_RESTRICTION_ERROR',
    });
  }

  // Attach normalized fields to request
  req.validatedCustomer = {
    customerName: finalName,
    customerPhone: normalizedPhone,
    customerAge: parsedAge,
  };

  next();
};
