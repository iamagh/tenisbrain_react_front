import axiosInstance from 'services/interceptor';

export const createAvailability = async (availabilityData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/shared/availabilitys/`, availabilityData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAccountInfoById = async (userId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/shared/accounts/${userId}`);
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

export const updateAccountInformation = async (formData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/shared/accounts/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/shared/accounts/`, {
      'chg_pwd': 'change',
      'current_password': currentPassword,
      'new_password': newPassword,
    });
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

export const closeAccount = async (): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/shared/accounts/`, {});
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const checkOnlinePayment = async (coachId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/shared/coach/${coachId}`);
    return response.data;
  } catch(error: any) {
    throw error.response ? error.response.data : error.messsage;
  }
}
