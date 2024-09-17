import axiosInstance from 'services/interceptor';


export const getAllProducts = async (coachId: string): Promise<any> => {
    try {
        const response = await axiosInstance.get(`/product/${coachId}`);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error.message;
    }
};


export const deleteProduct = async (productId: string): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/product/${productId}`);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error.message;
    }
};

export const saveProduct = async (coachId: string, data: any): Promise<any> => {
    try {
        const response = await axiosInstance.post(`/product/${coachId}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error.message;
    }
}


export const getProductsForCalendar = async (coachId: string) => {
    try {
        const response = await axiosInstance.get(`/shared/products/${coachId}`);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error.message;
    }
}

export const getProductStatusForPlayer = async (playerId: string) => {
    try {
        const response = await axiosInstance.get(`/shared/productsForPlayer/${playerId}`);
        return response.data;
    } catch (error: any) {
        throw error.response ? error.response.data : error.message;
    }
}
