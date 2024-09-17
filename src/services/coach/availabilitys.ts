import axiosInstance from 'services/interceptor';

export const createAvailability = async (availabilityData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/coach/availabilitys/`, availabilityData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAvailabilityById = async (availabilityId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coach/availabilitys/${availabilityId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllAvailabilitys = async (coachId: any = '', date = ''): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coach/availabilitys/?coachId=${coachId}&date=${date}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateAvailability = async (availabilityData: any, start_time: any=null): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/coach/availabilitys/`, {
      'start_time': start_time,
      'availability':availabilityData
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteAvailability = async (availabilityId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/coach/availabilitys/${availabilityId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
