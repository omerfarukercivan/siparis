import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const orderService = {
  getOrderStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/stats`);
      return response.data;
    } catch (error) {
      console.error('Sipariş istatistikleri alınırken hata oluştu:', error);
      throw error;
    }
  },

  getRecentOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/recent`);
      return response.data;
    } catch (error) {
      console.error('Son siparişler alınırken hata oluştu:', error);
      throw error;
    }
  },

  approveOrder: async (orderCode: string) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderCode}/approve`);
      return response.data;
    } catch (error) {
      console.error('Sipariş onaylanırken hata oluştu:', error);
      throw error;
    }
  },

  rejectOrder: async (orderCode: string) => {
    try {
      const response = await axios.put(`${API_URL}/orders/${orderCode}/reject`);
      return response.data;
    } catch (error) {
      console.error('Sipariş reddedilirken hata oluştu:', error);
      throw error;
    }
  }
}; 