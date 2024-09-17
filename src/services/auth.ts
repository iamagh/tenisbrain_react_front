import axiosInstance from './interceptor';

export const signup = async (
  first_name:string,
  last_name:string,
  email: string,
  password: string,
  role: string,
  userinfo: any
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/signup/`, {
      first_name,
      last_name,
      email,
      password,
      role,
      ...userinfo
    });
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/signin/`, {
      email,
      password,
    },
      {
        headers: {
          "Accept": "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const sigin = async (email: string, password: string): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/signin/`, {
      email,
      password,
    },
      {
        headers: {
          "Accept": "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const get_csrf_token = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/api/hello/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const callbackOauthGoogleLogin = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/auth/google/?access_token=${accessToken}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}
export const callbackOauthGoogleRegister = async (access_token: string, is_coach: string = '', data: any = {}) => {
  try {
    const response = await axiosInstance.post(`/auth/google/`, {
      access_token,
      is_coach,
      ...data
    },
      {
        headers: {
          "Accept": "*/*",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const callbackOauthLogin = async (platform: string, accessToken: string) => {
  try {
    const response = await axiosInstance.get(`/auth/${platform}/?access_token=${accessToken}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

export const verifyToken = async (data: any = {}) => {
  try {
    const response = await axiosInstance.post(`/verify-token/`, data);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}