import axiosInstance from 'services/interceptor';

export const getAllDashboard = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/dashboard/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
