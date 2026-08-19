import crypto from 'crypto';
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export function hashOTP(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}
export function generateAlphaPassword(length = 10) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const allChars = uppercase + lowercase;
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  for (let i = 2; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
export function isWithinISTTimeWindow(startHour, endHour) {
  const now = new Date();
  const istOffset = 5.5 * 60; 
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + istOffset * 60000);
  const currentHour = istTime.getHours();
  const currentMinute = istTime.getMinutes();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')} IST`;
  const allowed = currentHour >= startHour && currentHour < endHour;
  return {
    allowed,
    currentTimeIST: currentTimeStr,
    message: allowed
      ? 'Within allowed time window'
      : `This action is only available between ${startHour}:00 AM and ${endHour}:00 ${endHour <= 12 ? 'AM' : 'PM'} IST. Current time: ${currentTimeStr}`,
  };
}
export function isPaymentTimeAllowed() {
  return isWithinISTTimeWindow(10, 11);
}
export function isMobileLoginTimeAllowed() {
  return isWithinISTTimeWindow(10, 13);
}
export function isToday(date) {
  const today = new Date();
  const check = new Date(date);
  return (
    today.getFullYear() === check.getFullYear() &&
    today.getMonth() === check.getMonth() &&
    today.getDate() === check.getDate()
  );
}
export function parseUserAgent(uaString) {
  const UAParser = require('ua-parser-js');
  const parser = new UAParser(uaString);
  const result = parser.getResult();
  return {
    browser: result.browser.name || 'Unknown',
    browserVersion: result.browser.version || '',
    os: result.os.name || 'Unknown',
    osVersion: result.os.version || '',
    deviceType: result.device.type || 'desktop', 
    deviceVendor: result.device.vendor || '',
    deviceModel: result.device.model || '',
  };
}
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return '127.0.0.1';
}
export function isChromeBrowser(uaString) {
  const info = parseUserAgent(uaString);
  return info.browser.toLowerCase().includes('chrome');
}
export function isMobileDevice(uaString) {
  const info = parseUserAgent(uaString);
  return info.deviceType === 'mobile';
}
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
export function generateReceiptId() {
  return `IH_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxApplications: 1,
    duration: '1 month',
    features: [
      'Apply for 1 internship per month',
      'Basic profile',
      'Browse all listings',
    ],
  },
  bronze: {
    name: 'Bronze',
    price: 100,
    maxApplications: 3,
    duration: '1 month',
    features: [
      'Apply for 3 internships per month',
      'Enhanced profile',
      'Application tracking',
      'Email notifications',
    ],
  },
  silver: {
    name: 'Silver',
    price: 300,
    maxApplications: 5,
    duration: '1 month',
    features: [
      'Apply for 5 internships per month',
      'Priority profile',
      'Advanced tracking',
      'Resume highlights',
      'Email + SMS notifications',
    ],
  },
  gold: {
    name: 'Gold',
    price: 1000,
    maxApplications: Infinity,
    duration: '1 month',
    features: [
      'Unlimited internship applications',
      'Premium profile badge',
      'Priority application review',
      'Resume builder access',
      'All notifications',
      '24/7 priority support',
    ],
  },
};
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', requiresOTP: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', requiresOTP: false },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', requiresOTP: false },
  { code: 'pt', name: 'Português', flag: '🇧🇷', requiresOTP: false },
  { code: 'zh', name: '中文', flag: '🇨🇳', requiresOTP: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', requiresOTP: true },
];
export const INTERNSHIP_CATEGORIES = [
  'Web Development',
  'Mobile App Development',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Finance',
  'Human Resources',
  'Operations',
  'Sales',
  'Legal',
  'Architecture',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Research',
  'Teaching',
  'Other',
];
