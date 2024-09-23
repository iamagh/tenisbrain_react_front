import axiosInstance from 'services/interceptor';


export const makePayment = async (): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/make_payment/`, {
      "card_number": "4242424242424242",
      "expiry_month": "12",
      "expiry_year": "2030",
      "cvc": "123",
      "email": "codestar121879@gmail.com"
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const createCheckoutSession = async (): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/create-checkout-session`, {});
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const getCheckoutSessionStatus = async (sessionId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/session-status?session_id=${sessionId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const createPayment = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/create_payment`, {
      paymentMethodId: data.paymentMethodId,
      coachId: data.coachId,
      price: data.price,
      productId: data.productId,
      group: data.group,
      repeat: data.repeat,
      startTime: data.startTime,
      package_count: data.package_count,
      book_count : data.book_count,
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const coachOnboard = async (coachEmail: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/onboard_coach', { coachEmail: coachEmail });
    return response;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const updatePaidProduct = async (productId: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/update_paid_product', { productId });
    return response.data; 
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const updatePaidProductFields = async (paymentId: string, data:Record<string, any>): Promise<any> => {
  try {
    const response = await axiosInstance.post('/update_paid_product_fields', { paymentId, data });
    return response.data; 
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const cancelPaidProduct = async (paymentIntentId: string): Promise<any> => {
  try {
    const response = await axiosInstance.post('/cancel_payment', { paymentIntentId });
    return response.data; 
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}