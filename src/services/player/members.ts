import axiosInstance from 'services/interceptor';

export const createMember = async (memberData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/player/members/`, memberData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const geeMemberById = async (memberId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/members/${memberId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllMembers = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/members/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateMember = async (memberId: string, memberData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/player/members/${memberId}`, memberData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteMember = async (memberId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/player/members/${memberId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
