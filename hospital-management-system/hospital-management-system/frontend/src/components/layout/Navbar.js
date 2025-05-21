import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    Person,
    EventNote,
    Logout,
    PersonAdd,
    Login,
    MedicalServices,
} from '@mui/icons-material';
import { useAuth } from '../../utils/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [userMenu, setUserMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleOpenUserMenu = (event) => {
        setUserMenu(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setUserMenu(null);
    };

    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleCloseUserMenu();
    };

    const pages = isAuthenticated ? [
        { title: 'Dashboard', path: '/', icon: <Dashboard /> },
        { title: 'Patients', path: '/patients', icon: <Person /> },
        { title: 'Appointments', path: '/appointments', icon: <EventNote /> },
        { title: 'Doctors', path: '/doctors', icon: <MedicalServices /> },
    ] : [];

    const userMenuItems = isAuthenticated ? [
        { title: 'Profile', action: () => navigate('/profile') },
        { title: 'Logout', action: handleLogout },
    ] : [];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Desktop Logo */}
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        HOSPITAL MS
                    </Typography>

                    {/* Mobile Menu Button */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMobileMenuToggle}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={mobileMenuOpen}
                            onClose={handleMobileMenuToggle}
                        >
                            <Box
                                sx={{ width: 250 }}
                                role="presentation"
                                onClick={handleMobileMenuToggle}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{ my: 2, textAlign: 'center' }}
                                >
                                    Hospital MS
                                </Typography>
                                <Divider />
                                {isAuthenticated ? (
                                    <List>
                                        {pages.map((page) => (
                                            <ListItem key={page.title} disablePadding>
                                                <ListItemButton component={RouterLink} to={page.path}>
                                                    <ListItemIcon>{page.icon}</ListItemIcon>
                                                    <ListItemText primary={page.title} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                        <Divider />
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={handleLogout}>
                                                <ListItemIcon><Logout /></ListItemIcon>
                                                <ListItemText primary="Logout" />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                ) : (
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton component={RouterLink} to="/login">
                                                <ListItemIcon><Login /></ListItemIcon>
                                                <ListItemText primary="Login" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton component={RouterLink} to="/register">
                                                <ListItemIcon><PersonAdd /></ListItemIcon>
                                                <ListItemText primary="Register" />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                )}
                            </Box>
                        </Drawer>
                    </Box>

                    {/* Mobile Logo */}
                    <Typography
                        variant="h5"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        HOSPITAL MS
                    </Typography>

                    {/* Desktop Navigation */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.title}
                                component={RouterLink}
                                to={page.path}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>

                    {/* User Menu */}
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated && user ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt={user.username} src="/static/avatar.jpg">
                                            {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={userMenu}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(userMenu)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {userMenuItems.map((item) => (
                                        <MenuItem key={item.title} onClick={item.action}>
                                            <Typography textAlign="center">{item.title}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    color="inherit"
                                    sx={{ mr: 1 }}
                                >
                                    Login
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    color="inherit"
                                    variant="outlined"
                                    sx={{ border: '1px solid white' }}
                                >
                                    Register
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar; 