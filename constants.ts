
export const PAYMENT_AMOUNT = 75;
export const NGO_NAME = "EcoTrack Initiatives";
export const UPI_ID = "9635929052@ibl";
export const SUPPORT_PHONE_NUMBER = "9635929052";
export const SUPPORT_EMAIL = "shyantanbiswas7@gmail.com";

export const UPI_PAYMENT_URL = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NGO_NAME)}&am=${PAYMENT_AMOUNT}&cu=INR`;
