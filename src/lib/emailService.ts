import emailjs from '@emailjs/browser';
import { supabase } from './supabase';

// Replace these with your actual EmailJS credentials
const SERVICE_ID = 'service_5w02ryo';
const PUBLIC_KEY = 'HaCtTU4E-DRmJq2zI';

// Template IDs
const VEHICLE_LISTING_TEMPLATE = 'template_jj067sd';
const LOGIN_NOTIFICATION_TEMPLATE = 'template_dt0imx9';

export const sendVehicleListingEmail = async (vehicleData: any, userEmail: string) => {
  try {
    await emailjs.send(SERVICE_ID, VEHICLE_LISTING_TEMPLATE, {
      to_email: userEmail,
      vehicle_make: vehicleData.make,
      vehicle_model: vehicleData.model,
      vehicle_year: vehicleData.year,
      price: vehicleData.price,
      listing_date: new Date().toLocaleDateString(),
    }, PUBLIC_KEY);
  } catch (error) {
    console.error('Error sending vehicle listing email:', error);
  }
};

export const sendLoginNotificationEmail = async (userEmail: string) => {
  try {
    await emailjs.send(SERVICE_ID, LOGIN_NOTIFICATION_TEMPLATE, {
      to_email: userEmail,
      login_time: new Date().toLocaleString(),
    }, PUBLIC_KEY);
  } catch (error) {
    console.error('Error sending login notification email:', error);
  }
};

export async function sendKoreaOrderEmail(orderDetails: any, userEmail: string) {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: 'Korea Service Order Confirmation',
        template: 'korea-order',
        data: {
          orderNumber: orderDetails.id,
          productName: orderDetails.product_name,
          quantity: orderDetails.quantity,
          shippingAddress: orderDetails.shipping_address,
          status: orderDetails.status,
        }
      }
    });

    if (error) throw error;
  } catch (err) {
    console.error('Error sending email:', err);
  }
}
