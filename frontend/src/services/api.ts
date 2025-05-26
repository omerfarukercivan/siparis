import axios from 'axios';
import { useError } from '../contexts/ErrorContext';

const API_BASE_URL = 'http://localhost:8080/rest/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

export interface Product {
    productCode: string;
    name: string;
    size: number;
}

export interface ProductResponse {
    status: number;
    result: Product[];
}

export interface ProductInput {
    productCode: string;
    name: string;
    size: number;
}

export interface Outlet {
    outletCode: string;
    signName: string;
    address: string;
    longitude: number;
    latitude: number;
}

export interface OutletResponse {
    status: number;
    result: Outlet[];
}

export interface OutletInput {
    outletCode: string;
    signName: string;
    address: string;
    longitude: number;
    latitude: number;
}

export interface OrderProduct {
    productCode: string;
    quantity: number;
}

export interface Order {
    id: number;
    orderCode: string;
    outlet: Outlet;
    status: string;
    products: OrderProduct[];
}

export interface OrderResponse {
    status: number;
    result: Order[];
}

export interface OrderInput {
    orderCode: string;
    outletCode: string;
    products: OrderProduct[];
}

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        try {
            const response = await axios.get<ProductResponse>(`${API_BASE_URL}/product/list`);
            if (response.data.status === 200) {
                return response.data.result;
            }
            throw new Error('Ürünler alınamadı');
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    addProduct: async (product: ProductInput): Promise<Product> => {
        try {
            console.log('Adding product with data:', JSON.stringify(product, null, 2));
            const response = await axios.post<Product>(`${API_BASE_URL}/product/save`, product, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            console.log('Server response:', {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data
            });
            
            if (!response.data) {
                console.error('Empty response from server');
                throw new Error('Sunucudan geçerli bir yanıt alınamadı');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error adding product:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Server error details:', {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                        headers: error.response.headers,
                        url: error.config?.url
                    });
                    
                    const errorData = error.response.data;
                    if (errorData && errorData.exception && errorData.exception.message) {
                        throw new Error(errorData.exception.message);
                    }
                    
                    if (error.response.status === 404) {
                        throw new Error('Ürün ekleme endpoint\'i bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.');
                    } else if (error.response.status === 500) {
                        throw new Error('Sunucu hatası: Ürün kaydedilirken bir hata oluştu');
                    } else if (error.response.status === 400) {
                        throw new Error('Geçersiz ürün bilgileri. Lütfen tüm alanları doğru şekilde doldurun.');
                    } else if (error.response.status === 409) {
                        throw new Error('Bu ürün kodu zaten kullanımda. Lütfen farklı bir ürün kodu girin.');
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    console.error('Request error:', error.message);
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    },

    saveProduct: async (product: ProductInput): Promise<Product> => {
        try {
            console.log('Saving product:', product);
            const response = await api.post('/product/save', product);
            console.log('Save response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error saving product:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: error.config,
                    message: error.message
                });
            }
            throw error;
        }
    }
};

export const outletService = {
    getOutlets: async (): Promise<Outlet[]> => {
        try {
            const response = await axios.get<OutletResponse>(`${API_BASE_URL}/outlet/list`);
            if (response.data.status === 200) {
                return response.data.result;
            }
            throw new Error('Bayiler alınamadı');
        } catch (error) {
            console.error('Error fetching outlets:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: error.config,
                    message: error.message
                });
            }
            throw error;
        }
    },

    addOutlet: async (outlet: OutletInput): Promise<Outlet> => {
        try {
            console.log('Adding outlet:', outlet);
            const response = await axios.post<Outlet>(`${API_BASE_URL}/outlet/save`, outlet);
            console.log('Add outlet response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding outlet:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Error details:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        headers: error.response?.headers,
                        config: error.config,
                        message: error.message
                    });

                    const errorData = error.response.data;
                    if (errorData && errorData.exception && errorData.exception.message) {
                        throw new Error(errorData.exception.message);
                    }

                    if (error.response.status === 404) {
                        throw new Error('Bayi ekleme endpoint\'i bulunamadı');
                    } else if (error.response.status === 500) {
                        throw new Error('Sunucu hatası: Bayi kaydedilirken bir hata oluştu');
                    } else if (error.response.status === 400) {
                        throw new Error('Geçersiz bayi bilgileri. Lütfen tüm alanları doğru şekilde doldurun.');
                    } else if (error.response.status === 409) {
                        throw new Error('Bu bayi kodu zaten kullanımda. Lütfen farklı bir bayi kodu girin.');
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    }
};

export const orderService = {
    getOrders: async (): Promise<Order[]> => {
        try {
            console.log('Fetching orders...');
            const response = await axios.get<OrderResponse>(`${API_BASE_URL}/order/list`);
            console.log('Orders response:', response.data);
            
            if (!response.data) {
                throw new Error('Sunucudan geçerli bir yanıt alınamadı');
            }
            
            if (response.data.status === 200) {
                return response.data.result;
            }
            
            throw new Error('Siparişler alınamadı');
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const errorData = error.response.data;
                    if (errorData && errorData.exception && errorData.exception.message) {
                        throw new Error(errorData.exception.message);
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${errorData?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    },

    addOrder: async (order: OrderInput): Promise<Order> => {
        try {
            console.log('Adding order:', order);
            const response = await axios.post<Order>(`${API_BASE_URL}/order/create`, order);
            console.log('Add order response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding order:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Error details:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        headers: error.response?.headers,
                        config: error.config,
                        message: error.message
                    });

                    const errorData = error.response.data;
                    if (errorData && errorData.exception && errorData.exception.message) {
                        throw new Error(errorData.exception.message);
                    }

                    if (error.response.status === 404) {
                        throw new Error('Sipariş ekleme endpoint\'i bulunamadı');
                    } else if (error.response.status === 500) {
                        throw new Error('Sunucu hatası: Sipariş kaydedilirken bir hata oluştu');
                    } else if (error.response.status === 400) {
                        throw new Error('Geçersiz sipariş bilgileri. Lütfen tüm alanları doğru şekilde doldurun.');
                    } else if (error.response.status === 409) {
                        throw new Error('Bu sipariş kodu zaten kullanımda. Lütfen farklı bir sipariş kodu girin.');
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    },

    acceptOrder: async (orderCode: string): Promise<void> => {
        try {
            console.log('Accepting order:', orderCode);
            const response = await axios.put(`${API_BASE_URL}/order/accept/${orderCode}`);
            console.log('Accept order response:', response.data);
            
            if (!response.data || response.data.status !== 200) {
                throw new Error('Sipariş onaylanamadı');
            }
        } catch (error) {
            console.error('Error accepting order:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 404) {
                        throw new Error('Onaylanacak sipariş bulunamadı');
                    } else if (error.response.status === 403) {
                        throw new Error('Bu siparişi onaylama yetkiniz bulunmamaktadır');
                    } else if (error.response.status === 400) {
                        throw new Error('Bu sipariş zaten onaylanmış durumda');
                    } else if (error.response.status === 405) {
                        throw new Error('Bu işlem için geçersiz HTTP metodu');
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    },

    rejectOrder: async (orderCode: string): Promise<void> => {
        try {
            console.log('Rejecting order:', orderCode);
            const response = await axios.put(`${API_BASE_URL}/order/reject/${orderCode}`);
            console.log('Reject order response:', response.data);
            
            if (!response.data || response.data.status !== 200) {
                throw new Error('Sipariş reddedilemedi');
            }
        } catch (error) {
            console.error('Error rejecting order:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 404) {
                        throw new Error('Reddedilecek sipariş bulunamadı');
                    } else if (error.response.status === 403) {
                        throw new Error('Bu siparişi reddetme yetkiniz bulunmamaktadır');
                    } else if (error.response.status === 400) {
                        throw new Error('Bu sipariş zaten reddedilmiş durumda');
                    } else if (error.response.status === 405) {
                        throw new Error('Bu işlem için geçersiz HTTP metodu');
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    },

    deleteOrder: async (orderCode: string): Promise<void> => {
        try {
            console.log('Deleting order:', orderCode);
            const response = await axios.delete(`${API_BASE_URL}/order/delete/${orderCode}`);
            console.log('Delete order response:', response.data);
            
            if (!response.data || response.data.status !== 200) {
                throw new Error('Sipariş silinemedi');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 404) {
                        throw new Error('Silinecek sipariş bulunamadı');
                    } else if (error.response.status === 403) {
                        throw new Error('Bu siparişi silme yetkiniz bulunmamaktadır');
                    } else if (error.response.status === 400) {
                        throw new Error('Bu sipariş silinemez çünkü zaten onaylanmış durumda');
                    }
                    throw new Error(`Sunucu hatası: ${error.response.status} - ${error.response.data?.message || 'Bilinmeyen hata'}`);
                } else if (error.request) {
                    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
                } else {
                    throw new Error(`İstek hatası: ${error.message}`);
                }
            }
            throw error;
        }
    }
};

export default api; 