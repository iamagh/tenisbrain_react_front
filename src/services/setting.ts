
import axiosInstance from 'services/interceptor';

export const saveSettings = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/settings/`, data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}
  
export const updateSignupProcess = async (data: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/update-signup-process/`, data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const getSignupProcess = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/get-signup-process/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}