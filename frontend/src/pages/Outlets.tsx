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
import { outletService, Outlet } from '../services/api';
import axios from 'axios';

const Outlets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching outlets...');
      const data = await outletService.getOutlets();
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
        setOutlets([]);
        return;
      }
      
      console.log('Setting outlets:', data);
      setOutlets(data);
    } catch (err) {
      console.error('Error in fetchOutlets:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Server error response:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
          setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen hata'}`);
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        } else {
          console.error('Request error:', err.message);
          setError(`İstek hatası: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`Bayiler yüklenirken bir hata oluştu: ${err.message}`);
      } else {
        setError('Bayiler yüklenirken beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('Arama yapılıyor:', searchQuery);
  };

  const handleAddOutlet = () => {
    navigate('/outlets/add-outlet');
  };

  const filteredOutlets = outlets.filter(outlet => 
    outlet.outletCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.signName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    outlet.address.toLowerCase().includes(searchQuery.toLowerCase())
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
          Bayiler
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
            label="Bayi Ara"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bayi kodu, bayi adı veya adres giriniz"
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
            onClick={handleAddOutlet}
            sx={{ 
              minWidth: { xs: '100%', sm: '200px' },
              height: '56px'
            }}
          >
            Yeni Bayi
          </Button>
        </Paper>

        {/* Hata Mesajı */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Bayi Tablosu */}
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
            <Table stickyHeader aria-label="outlets table">
              <TableHead>
                <TableRow>
                  <TableCell>Bayi Kodu</TableCell>
                  <TableCell>Bayi Adı</TableCell>
                  <TableCell>Adres</TableCell>
                  <TableCell align="right">Enlem</TableCell>
                  <TableCell align="right">Boylam</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOutlets.map((outlet) => (
                  <TableRow key={outlet.outletCode}>
                    <TableCell>{outlet.outletCode}</TableCell>
                    <TableCell>{outlet.signName}</TableCell>
                    <TableCell>{outlet.address}</TableCell>
                    <TableCell align="right">{outlet.latitude.toFixed(6)}</TableCell>
                    <TableCell align="right">{outlet.longitude.toFixed(6)}</TableCell>
                  </TableRow>
                ))}
                {filteredOutlets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Bayi bulunamadı
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

export default Outlets; 