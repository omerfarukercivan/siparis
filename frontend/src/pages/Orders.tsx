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
  Alert,
  Chip,
  Collapse,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { orderService, Order, Outlet, OrderProduct } from '../services/api';
import axios from 'axios';
import { useError } from '../contexts/ErrorContext';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning.main';
    case 'accept':
    case 'accepted':
      return 'success.main';
    case 'reject':
    case 'rejected':
      return 'error.main';
    default:
      return 'text.primary';
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Bekliyor';
    case 'accept':
    case 'accepted':
      return 'Onaylandı';
    case 'reject':
    case 'rejected':
      return 'Reddedildi';
    default:
      return status;
  }
};

interface OrderRowProps {
  order: Order;
  onStatusChange: () => void;
  onDelete: () => void;
}

const OrderRow = ({ order, onStatusChange, onDelete }: OrderRowProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { showError } = useError();

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await orderService.acceptOrder(order.orderCode);
      onStatusChange();
    } catch (err) {
      console.error('Error accepting order:', err);
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('Sipariş onaylanırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await orderService.rejectOrder(order.orderCode);
      onStatusChange();
    } catch (err) {
      console.error('Error rejecting order:', err);
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('Sipariş reddedilirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await onDelete();
      setDeleteDialogOpen(false);
      onStatusChange();
    } catch (err) {
      console.error('Error deleting order:', err);
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('Sipariş silinirken bir hata oluştu');
      }
      setDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow 
        sx={{ 
          '& > *': { borderBottom: 'unset' },
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
        onClick={() => setOpen(!open)}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderCode}</TableCell>
        <TableCell>{order.outlet.signName}</TableCell>
        <TableCell>
          <Typography
            sx={{
              color: getStatusColor(order.status),
              fontWeight: 500
            }}
          >
            {getStatusLabel(order.status)}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Sil">
              <IconButton
                color="error"
                onClick={handleDelete}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {order.status.toLowerCase() === 'pending' && (
              <>
                <Tooltip title="Onayla">
                  <IconButton
                    color="success"
                    onClick={handleAccept}
                    disabled={loading}
                    size="small"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reddet">
                  <IconButton
                    color="error"
                    onClick={handleReject}
                    disabled={loading}
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Ürünler
              </Typography>
              <Table size="small" aria-label="products">
                <TableHead>
                  <TableRow>
                    <TableCell>Ürün Kodu</TableCell>
                    <TableCell align="right">Miktar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {product.productCode}
                      </TableCell>
                      <TableCell align="right">{product.quantity} adet</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Siparişi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            autoFocus
            disabled={loading}
          >
            {loading ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching orders...');
      const data = await orderService.getOrders();
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
        setOrders([]);
        return;
      }
      
      console.log('Setting orders:', data);
      setOrders(data);
    } catch (err) {
      console.error('Error in fetchOrders:', err);
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
        setError(`Siparişler yüklenirken bir hata oluştu: ${err.message}`);
      } else {
        setError('Siparişler yüklenirken beklenmeyen bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderCode: string) => {
    try {
      setError(null);
      await orderService.deleteOrder(orderCode);
      await fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Sipariş silinirken bir hata oluştu');
      }
    }
  };

  const handleSearch = () => {
    console.log('Arama yapılıyor:', searchQuery);
  };

  const handleAddOrder = () => {
    navigate('/orders/add-order');
  };

  const filteredOrders = orders.filter(order => 
    order.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.outlet.outletCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.outlet.signName.toLowerCase().includes(searchQuery.toLowerCase())
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
          Siparişler
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
            label="Sipariş Ara"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sipariş kodu, bayi kodu veya bayi adı giriniz"
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
            onClick={handleAddOrder}
            sx={{ 
              minWidth: { xs: '100%', sm: '200px' },
              height: '56px'
            }}
          >
            Yeni Sipariş
          </Button>
        </Paper>

        {/* Hata Mesajı */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Sipariş Tablosu */}
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
            <Table stickyHeader aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Sipariş Kodu</TableCell>
                  <TableCell>Bayi Adı</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <OrderRow 
                    key={order.orderCode} 
                    order={order} 
                    onStatusChange={fetchOrders}
                    onDelete={() => handleDeleteOrder(order.orderCode)}
                  />
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Sipariş bulunamadı
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

export default Orders; 