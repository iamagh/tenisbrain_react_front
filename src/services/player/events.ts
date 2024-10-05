import axiosInstance from 'services/interceptor';

export const createEvent = async (eventData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/player/events/`, eventData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getEventById = async (eventId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/events/${eventId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};


export const getCoachEvents = async (coachId: string): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/events/${coachId}`);
    /**
     * TODO: set store's player state
     * response data should have info for members of coach
     * 
     */
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllEvents = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get(`/player/events/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};


export const updateEvent = async (eventId: string, eventData: any): Promise<any> => {
  try {
    // eventData.transaction_id = eventData.transaction_id ? eventData.transaction_id : "";
    const response = await axiosInstance.post(`/player/events/${eventId}`, eventData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllEventSeries = async (event_series: string) : Promise<any> => {
  try {
    const response = await axiosInstance.get(`/events/${event_series}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
}

// export const deleteEvent = async (eventId: string, txId: string): Promise<any> => {
//   try {
//     const response = await axiosInstance.delete(`/player/events/${eventId}`, {
//       params: {txId}
//     });
//     return response.data;
//   } catch (error: any) {
//     throw error.response ? error.response.data : error.message;
//   }
// };

export const deleteEvent = async (eventId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/player/events/${eventId}`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};
