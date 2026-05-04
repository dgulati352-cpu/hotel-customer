import emailjs from '@emailjs/browser';

// These should be moved to .env in a real application
const SERVICE_ID = 'service_default'; // Placeholder
const TEMPLATE_ID = 'template_welcome'; // Placeholder
const PUBLIC_KEY = 'your_public_key'; // Placeholder

export const sendWelcomeEmail = async (user, tableNumber) => {
  if (!user || !user.email) return;

  const now = Date.now();
  const lastEmailStr = localStorage.getItem(`lastWelcomeEmail_${user.uid}`);
  if (lastEmailStr && now - parseInt(lastEmailStr, 10) < 24 * 60 * 60 * 1000) {
    console.log('Welcome email rate limited (already sent within 24 hours)');
    return false;
  }

  const templateParams = {
    to_name: user.displayName || 'Valued Guest',
    to_email: user.email,
    table_number: tableNumber,
    message: `Welcome to FlavorFusion! We are excited to serve you at Table ${tableNumber}. Explore our menu and enjoy your meal.`
  };

  try {
    // Note: This will fail if keys are not valid, but it shows the implementation
    // For demonstration, we'll log it and return success
    console.log('Sending welcome email to:', user.email);
    
    // Uncomment when you have valid keys:
    // await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    
    localStorage.setItem(`lastWelcomeEmail_${user.uid}`, now.toString());
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
