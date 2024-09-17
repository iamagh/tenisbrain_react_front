import axiosInstance from 'services/interceptor';

export const getAllAvailabilitys = async (coachId = '', date = ''): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/availabilitys/?coachId=${coachId}&date=${date}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

