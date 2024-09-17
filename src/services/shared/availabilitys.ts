import axiosInstance from 'services/interceptor';
import { converterDataParaDjangoFormat } from 'utils/others';

export const createAvailability = async (availabilityData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/shared/availabilitys/`, availabilityData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAvailabilityById = async (availabilityId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/shared/availabilitys/${availabilityId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllAvailabilitys = async (coachId = '', date = ''): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/shared/availabilitys/?coachId=${coachId}&date=${date}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateAvailability = async (availabilityId: string, availabilityData: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/shared/availabilitys/${availabilityId}`, availabilityData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteAvailability = async (availabilityId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/shared/availabilitys/${availabilityId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
