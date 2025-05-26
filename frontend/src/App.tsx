import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Orders from './pages/Orders';
import Outlets from './pages/Outlets';
import Products from './pages/Products';
import AddOrder from './pages/AddOrder';
import AddOutlet from './pages/AddOutlet';
import AddProduct from './pages/AddProduct';
import { ErrorProvider } from './contexts/ErrorContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ErrorProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/orders" replace />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/add-order" element={<AddOrder />} />
            <Route path="/outlets" element={<Outlets />} />
            <Route path="/outlets/add-outlet" element={<AddOutlet />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add-product" element={<AddProduct />} />
            {/* Diğer route'lar buraya eklenecek */}
          </Routes>
        </Router>
      </ThemeProvider>
    </ErrorProvider>
  );
}

export default App;
