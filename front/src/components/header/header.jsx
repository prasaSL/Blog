import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import "../../index.css";
import "./header.css";
import { useAuth } from '../../context/AuthContext';
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isMenuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    logout();
    handleMenuClose();
  };

  const navItems = ["About", "Contact"];

  const drawer = (
    <Box onClick={handleDrawerToggle} className="mobile-drawer">
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={item}
                className="drawer-list-item"
                primaryTypographyProps={{ style: { fontSize: "1.1rem" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, color: "white" }} />
            <ListItemText
              primary="Logout"
              className="drawer-list-item"
              primaryTypographyProps={{ style: { fontSize: "1.1rem" } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const userMenuId = "user-account-menu";
  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      id={userMenuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        className: "user-menu-paper",
      }}
    >
      <MenuItem onClick={handleMenuClose} className="user-menu-item">
        <PersonIcon className="menu-icon" />
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose} className="user-menu-item">
        <SettingsIcon className="menu-icon" />
        Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} className="user-menu-item logout-item">
        <LogoutIcon className="menu-icon" />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" className="custom-header">
      <Toolbar className="custom-toolbar ">
        {/* Left: Logo */}
        <div className="logo-section">
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className="logo-text">
            My Blog
          </Typography>
        </div>

        {/* Right: Navigation - Desktop */}
       <div className="nav-section">
  {!isMobile && (
    <div className="nav-links">
      {navItems.map((item) => (
        <Button key={item} className="nav-button">
          {item}
        </Button>
      ))}
    </div>
  )}
  
  {/* User Account Button - MOVED OUTSIDE the isMobile condition */}
  <IconButton
    edge="end"
    aria-label="account of current user"
    aria-controls={userMenuId}
    aria-haspopup="true"
    onClick={handleProfileMenuOpen}
    color="inherit"
    className="user-account-button"
    sx={{ borderRadius: '30px' }}
  >
    <div className="user-account">
      <Avatar className="user-avatar">JS</Avatar>
      <div className="username">{user?.name}</div>
    </div>
  </IconButton>
</div>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu Dropdown */}
      {renderUserMenu}
    </AppBar>
  );
}
