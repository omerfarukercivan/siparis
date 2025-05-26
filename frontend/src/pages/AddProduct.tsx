import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/api';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    size: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.productCode.trim()) {
      setError('Ürün kodu boş olamaz');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Ürün adı boş olamaz');
      return false;
    }
    if (!formData.size || parseInt(formData.size) <= 0) {
      setError('Geçerli bir boyut giriniz');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('Submitting form data:', formData);
      const productData = {
        productCode: formData.productCode.trim(),
        name: formData.name.trim(),
        size: parseInt(formData.size)
      };
      
      console.log('Sending product data:', productData);
      await productService.addProduct(productData);
      console.log('Product added successfully');
      navigate('/products');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Server error response:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
          
          if (err.response.status === 500) {
            setError('Sunucu hatası: Ürün eklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
          } else if (err.response.status === 400) {
            setError('Geçersiz ürün bilgileri. Lütfen tüm alanları doğru şekilde doldurun.');
          } else if (err.response.status === 409) {
            setError('Bu ürün kodu zaten kullanımda. Lütfen farklı bir ürün kodu girin.');
          } else {
            setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen hata'}`);
          }
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        } else {
          console.error('Request error:', err.message);
          setError(`İstek hatası: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`Ürün eklenirken bir hata oluştu: ${err.message}`);
      } else {
        setError('Ürün eklenirken beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Yeni Ürün Ekle
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Ürün Kodu"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && !formData.productCode.trim()}
            />
            <TextField
              fullWidth
              label="Ürün Adı"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && !formData.name.trim()}
            />
            <TextField
              fullWidth
              label="Miktar"
              name="size"
              type="number"
              value={formData.size}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              inputProps={{ min: 1 }}
              disabled={loading}
              error={!!error && (!formData.size || parseInt(formData.size) <= 0)}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Ürün Ekle'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddProduct; 