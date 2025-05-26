import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { productService, Product } from '../services/api';
import axios from 'axios';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products...');
      const data = await productService.getProducts();
      console.log('Raw API response:', data);
      
      if (!data) {
        throw new Error('API boş veri döndürdü');
      }
      
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        throw new Error('API yanıtı beklenen formatta değil');
      }
      
      if (data.length === 0) {
        console.log('API returned empty array');
        setProducts([]);
        return;
      }
      
      console.log('Setting products:', data);
      setProducts(data);
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Sunucu yanıt verdi ama hata kodu döndü
          console.error('Server error response:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
          setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen hata'}`);
        } else if (err.request) {
          // İstek yapıldı ama yanıt alınamadı
          console.error('No response received:', err.request);
          setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        } else {
          // İstek oluşturulurken hata oluştu
          console.error('Request error:', err.message);
          setError(`İstek hatası: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`Ürünler yüklenirken bir hata oluştu: ${err.message}`);
      } else {
        setError('Ürünler yüklenirken beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('Arama yapılıyor:', searchQuery);
  };

  const handleAddProduct = () => {
    navigate('/products/add-product');
  };

  const filteredProducts = products.filter(product => 
    product.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Ürünler
        </Typography>

        {/* Arama ve Ekleme Alanı */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4,
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' }
          }}
        >
          <TextField
            fullWidth
            label="Ürün Ara"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün kodu veya ürün adı giriniz"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            sx={{ 
              minWidth: { xs: '100%', sm: '200px' },
              height: '56px'
            }}
          >
            Yeni Ürün
          </Button>
        </Paper>

        {/* Hata Mesajı */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Ürün Tablosu */}
        <TableContainer 
          component={Paper} 
          elevation={3}
          sx={{ 
            maxHeight: 'calc(100vh - 350px)',
            overflow: 'auto'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell>Ürün Kodu</TableCell>
                  <TableCell>Ürün Adı</TableCell>
                  <TableCell align="right">Ürün Miktarı</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.productCode}>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell align="right">{product.size}</TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Ürün bulunamadı
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Container>
    </Box>
  );
};

export default Products; 