import axiosInstance from 'services/interceptor';

export const createExerciseType = async (exerciseData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/coach/exercise-types/`, exerciseData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getExerciseTypeById = async (exerciseId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coach/exercise-types/${exerciseId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllExerciseTypes = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/coach/exercise-types/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateExerciseType = async (exerciseId: string, exerciseData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/coach/exercise-types/${exerciseId}`, exerciseData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteExerciseType = async (exerciseId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/coach/exercise-types/${exerciseId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
