import axiosInstance from 'services/interceptor';

export const createExercise = async (exerciseData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/coach/exercises/`, exerciseData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getExerciseById = async (exerciseId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coach/exercises/${exerciseId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllExercises = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coach/exercises/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateExercise = async (exerciseId: string, exerciseData: any): Promise<any> => {
  try {
    const response = await axiosInstance.put(`/coach/exercises/${exerciseId}`, exerciseData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteExercise = async (exerciseId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/coach/exercises/${exerciseId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
