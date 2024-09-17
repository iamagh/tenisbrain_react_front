import axiosInstance from 'services/interceptor';

export const contactUs = async (contactMsg: any): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/contact-us/`, contactMsg);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : error.message;
    }
};
