import axiosInstance from 'services/interceptor';

export const createCoach = async (coachData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/player/coaches/`, coachData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getCoachById = async (coachId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/coaches/${coachId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllCoaches = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/coaches/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateCoach = async (coachId: string, coachData: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/player/coaches/${coachId}`, coachData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteCoach = async (coachId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/player/coaches/${coachId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
