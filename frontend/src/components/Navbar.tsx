import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../logo.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box 
            component="img"
            src={logo}
            alt="Logo"
            sx={{ 
              height: 40,
              mr: 2,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/orders')}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Sipariş Yönetimi
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/orders')}
              sx={{
                backgroundColor: isActive('/orders') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/orders') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                },
                fontWeight: isActive('/orders') ? 'bold' : 'normal'
              }}
            >
              Siparişler
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/outlets')}
              sx={{
                backgroundColor: isActive('/outlets') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/outlets') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                },
                fontWeight: isActive('/outlets') ? 'bold' : 'normal'
              }}
            >
              Bayiler
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/products')}
              sx={{
                backgroundColor: isActive('/products') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/products') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                },
                fontWeight: isActive('/products') ? 'bold' : 'normal'
              }}
            >
              Ürünler
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 