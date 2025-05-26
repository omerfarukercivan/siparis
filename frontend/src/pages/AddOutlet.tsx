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
import { outletService } from '../services/api';
import axios from 'axios';

const AddOutlet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    outletCode: '',
    signName: '',
    address: '',
    longitude: '',
    latitude: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.outletCode.trim()) {
      setError('Bayi kodu boş olamaz');
      return false;
    }
    if (!formData.signName.trim()) {
      setError('Bayi adı boş olamaz');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Adres boş olamaz');
      return false;
    }
    if (!formData.longitude || isNaN(parseFloat(formData.longitude))) {
      setError('Geçerli bir boylam giriniz');
      return false;
    }
    if (!formData.latitude || isNaN(parseFloat(formData.latitude))) {
      setError('Geçerli bir enlem giriniz');
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
      await outletService.addOutlet({
        outletCode: formData.outletCode.trim(),
        signName: formData.signName.trim(),
        address: formData.address.trim(),
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude)
      });
      navigate('/outlets');
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`Sunucu hatası: ${err.response.status} - ${err.response.data?.message || 'Bilinmeyen hata'}`);
        } else if (err.request) {
          setError('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
        } else {
          setError(`İstek hatası: ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`Bayi eklenirken bir hata oluştu: ${err.message}`);
      } else {
        setError('Bayi eklenirken beklenmeyen bir hata oluştu');
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
          Yeni Bayi Ekle
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
              label="Bayi Kodu"
              name="outletCode"
              value={formData.outletCode}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && !formData.outletCode.trim()}
            />
            <TextField
              fullWidth
              label="Bayi Adı"
              name="signName"
              value={formData.signName}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && !formData.signName.trim()}
            />
            <TextField
              fullWidth
              label="Adres"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && !formData.address.trim()}
            />
            <TextField
              fullWidth
              label="Boylam"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && (!formData.longitude || isNaN(parseFloat(formData.longitude)))}
              inputProps={{ step: "0.000001" }}
            />
            <TextField
              fullWidth
              label="Enlem"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleChange}
              required
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!error && (!formData.latitude || isNaN(parseFloat(formData.latitude)))}
              inputProps={{ step: "0.000001" }}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/outlets')}
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
                {loading ? <CircularProgress size={24} /> : 'Bayi Ekle'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddOutlet; 