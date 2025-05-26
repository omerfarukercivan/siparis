import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { orderService, productService, outletService, Product, Outlet, OrderProduct } from '../services/api';

const AddOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [formData, setFormData] = useState({
    orderCode: '',
    outletCode: '',
    products: [{ productCode: '', quantity: 1 }] as OrderProduct[]
  });

  useEffect(() => {
    fetchProductsAndOutlets();
  }, []);

  const fetchProductsAndOutlets = async () => {
    try {
      setLoading(true);
      const [productsData, outletsData] = await Promise.all([
        productService.getProducts(),
        outletService.getOutlets()
      ]);
      setProducts(productsData);
      setOutlets(outletsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Ürün ve bayi bilgileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const newProducts = [...formData.products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productCode: '', quantity: 1 }]
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validasyon
      if (!formData.orderCode || !formData.outletCode) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      if (formData.products.some(p => !p.productCode || p.quantity <= 0)) {
        throw new Error('Lütfen tüm ürün bilgilerini doğru şekilde girin');
      }

      await orderService.addOrder(formData);
      navigate('/orders');
    } catch (err) {
      console.error('Error creating order:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Sipariş oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      orderCode: '',
      outletCode: '',
      products: [{ productCode: '', quantity: 1 }]
    });
    setError(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Yeni Sipariş Ekle
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Sipariş Kodu"
                  value={formData.orderCode}
                  onChange={(e) => handleChange('orderCode', e.target.value)}
                  required
                />
                <Autocomplete
                  sx={{ width: { xs: '100%', sm: '50%' } }}
                  options={outlets}
                  getOptionLabel={(option) => `${option.outletCode} - ${option.signName}`}
                  value={outlets.find(o => o.outletCode === formData.outletCode) || null}
                  onChange={(_, newValue) => handleChange('outletCode', newValue?.outletCode || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bayi"
                      required
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Ürünler
                </Typography>
                {formData.products.map((product, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Autocomplete
                      sx={{ flexGrow: 1 }}
                      options={products}
                      getOptionLabel={(option) => `${option.productCode} - ${option.name}`}
                      value={products.find(p => p.productCode === product.productCode) || null}
                      onChange={(_, newValue) => handleProductChange(index, 'productCode', newValue?.productCode || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Ürün"
                          required
                        />
                      )}
                    />
                    <TextField
                      type="number"
                      label="Miktar"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      inputProps={{ min: 1 }}
                      required
                      sx={{ width: '120px' }}
                    />
                    {index > 0 && (
                      <IconButton 
                        onClick={() => removeProduct(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addProduct}
                  sx={{ mt: 1 }}
                >
                  Ürün Ekle
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClear}
                  disabled={loading}
                >
                  Temizle
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Kaydet'}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddOrder; 