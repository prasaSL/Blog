import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import CommentIcon from "@mui/icons-material/Comment";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import CancelIcon from "@mui/icons-material/Cancel";
import "./adminPanel.css";
import Post from "../post/post";

// Mock data for blog posts
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    status: "published",
    category: "React",
    date: "2025-08-01",
    comments: 15,
    views: 1243,
  },
  {
    id: 2,
    title: "Advanced CSS Techniques",
    status: "draft",
    category: "CSS",
    date: "2025-08-10",
    comments: 0,
    views: 0,
  },
  {
    id: 3,
    title: "JavaScript Promises Explained",
    status: "published",
    category: "JavaScript",
    date: "2025-07-28",
    comments: 23,
    views: 2105,
  },
  {
    id: 4,
    title: "Building a REST API with Node.js",
    status: "published",
    category: "Node.js",
    date: "2025-07-15",
    comments: 8,
    views: 876,
  },
  {
    id: 5,
    title: "Introduction to TypeScript",
    status: "draft",
    category: "TypeScript",
    date: "2025-08-05",
    comments: 0,
    views: 0,
  },
  {
    id: 6,
    title: "Responsive Design Best Practices",
    status: "published",
    category: "CSS",
    date: "2025-07-10",
    comments: 12,
    views: 1562,
  },
  {
    id: 7,
    title: "State Management with Redux",
    status: "published",
    category: "React",
    date: "2025-06-22",
    comments: 18,
    views: 1987,
  },
];

// Component for dashboard stats card
const StatCard = ({ title, value, icon, color }) => (
  <Card className="stat-card">
    <CardContent>
      <Box className="stat-card-content">
        <Box>
          <Typography variant="h6" component="div" className="stat-card-title">
            {title}
          </Typography>
          <Typography variant="h4" component="div" className="stat-card-value">
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: color }} className="stat-card-icon">
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminPanel() {
  const [selectedMenu, setSelectedMenu] = useState("posts");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  // Menu handling
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setMobileOpen(false);
  };

  // Profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dialog handlers
  const handleOpenDialog = (type, post = null) => {
    setDialogType(type);
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
    setPostImage(null);
  };

  // Sidebar menu items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, value: "dashboard" },
    { text: "Blog Posts", icon: <ArticleIcon />, value: "posts" },
    // { text: "Categories", icon: <CategoryIcon />, value: "categories" },
    // { text: "Comments", icon: <CommentIcon />, value: "comments" },
    // { text: "Users", icon: <PeopleIcon />, value: "users" },
    // { text: "Settings", icon: <SettingsIcon />, value: "settings" },
  ];

  // Add these handlers for image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPostImage(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box className="admin-panel">
      {/* Top AppBar */}
      <AppBar position="fixed" className="admin-appbar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="menu-button"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="admin-title"
          >
            Blog Admin Panel
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar className="admin-avatar">A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            className="profile-menu"
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box className="admin-content-container">
        {/* Sidebar */}

        <Box className={`admin-sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.value}
                className={
                  selectedMenu === item.value
                    ? "menu-item-selected"
                    : "menu-item"
                }
                onClick={() => handleMenuClick(item.value)}
              >
                <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button className="menu-item logout-item">
              <ListItemIcon className="menu-icon">
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>

        {/* Overlay to close sidebar when clicked outside */}
        {mobileOpen && (
          <Box className="sidebar-overlay" onClick={handleDrawerToggle} />
        )}

        {/* Main content */}
        <Box className="admin-main-content">
          {selectedMenu === "dashboard" && (
            <Container maxWidth="lg" className="dashboard-container">
              <Typography variant="h4" className="page-title">
                Dashboard
              </Typography>
              <Grid container spacing={3} className="stats-container">
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Total Posts"
                    value="24"
                    icon={<ArticleIcon />}
                    color="var(--accent-color)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Comments"
                    value="143"
                    icon={<CommentIcon />}
                    color="#4CAF50"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Users"
                    value="56"
                    icon={<PeopleIcon />}
                    color="#FF9800"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatCard
                    title="Categories"
                    value="8"
                    icon={<CategoryIcon />}
                    color="#9C27B0"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} className="recent-content">
                <Grid item xs={12} md={8}>
                  <Paper className="content-paper">
                    <Typography variant="h6" className="paper-title">
                      Recent Posts
                    </Typography>
                    <Divider />
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Views</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mockPosts.slice(0, 5).map((post) => (
                            <TableRow key={post.id}>
                              <TableCell>{post.title}</TableCell>
                              <TableCell>{post.date}</TableCell>
                              <TableCell>
                                <Chip
                                  label={post.status}
                                  size="small"
                                  color={
                                    post.status === "published"
                                      ? "success"
                                      : "default"
                                  }
                                />
                              </TableCell>
                              <TableCell>{post.views}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box className="view-all-button">
                      <Button
                        variant="text"
                        onClick={() => handleMenuClick("posts")}
                      >
                        View All Posts
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper className="content-paper">
                    <Typography variant="h6" className="paper-title">
                      Quick Actions
                    </Typography>
                    <Divider />
                    <List>
                      <ListItem button onClick={() => handleOpenDialog("add")}>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add New Post" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <CommentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Moderate Comments" />
                      </ListItem>
                      <ListItem button>
                        <ListItemIcon>
                          <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Categories" />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          )}

          {selectedMenu === "posts" && (
            <Container maxWidth="lg" className="posts-container">
              <Box className="page-header">
                <Typography variant="h4" className="page-title">
                  Blog Posts
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog("add")}
                  className="add-button"
                >
                  Add New Post
                </Button>
              </Box>

              <Paper className="content-paper">
                <Box className="table-toolbar">
                  <Box className="search-box">
                    <SearchIcon className="search-icon" />
                    <TextField
                      variant="outlined"
                      placeholder="Search posts..."
                      size="small"
                      className="search-input"
                    />
                  </Box>
                  <Box className="filter-buttons">
                    <Button variant="outlined" size="small">
                      All
                    </Button>
                    <Button variant="outlined" size="small">
                      Published
                    </Button>
                    <Button variant="outlined" size="small">
                      Drafts
                    </Button>
                  </Box>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Comments</TableCell>
                        <TableCell>Views</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockPosts
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>{post.category}</TableCell>
                            <TableCell>{post.date}</TableCell>
                            <TableCell>
                              <Chip
                                label={post.status}
                                size="small"
                                color={
                                  post.status === "published"
                                    ? "success"
                                    : "default"
                                }
                              />
                            </TableCell>
                            <TableCell>{post.comments}</TableCell>
                            <TableCell>{post.views}</TableCell>
                            <TableCell>
                              <Box className="action-buttons">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog("view", post)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog("edit", post)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleOpenDialog("delete", post)
                                  }
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={mockPosts.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Container>
          )}

          {/* {selectedMenu === "categories" && (
            <Container maxWidth="lg">
              <Typography variant="h4" className="page-title">
                Categories
              </Typography>
              <Paper className="content-paper">
                <Typography>Categories management content goes here</Typography>
              </Paper>
            </Container>
          )}

          {selectedMenu === "comments" && (
            <Container maxWidth="lg">
              <Typography variant="h4" className="page-title">
                Comments
              </Typography>
              <Paper className="content-paper">
                <Typography>Comments management content goes here</Typography>
              </Paper>
            </Container>
          )}

          {selectedMenu === "users" && (
            <Container maxWidth="lg">
              <Typography variant="h4" className="page-title">
                Users
              </Typography>
              <Paper className="content-paper">
                <Typography>User management content goes here</Typography>
              </Paper>
            </Container>
          )}

          {selectedMenu === "settings" && (
            <Container maxWidth="lg">
              <Typography variant="h4" className="page-title">
                Settings
              </Typography>
              <Paper className="content-paper">
                <Typography>Settings content goes here</Typography>
              </Paper>
            </Container>
          )} */}
        </Box>
      </Box>

      {/* Dialogs */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={dialogType === "delete" ? "xs" : "md"}
      >
        {dialogType === "add" && (
          <>
            <DialogTitle>Add New Post</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Post Title"
                fullWidth
                variant="outlined"
                className="dialog-input"
              />
              <TextField
                margin="dense"
                label="Category"
                fullWidth
                variant="outlined"
                className="dialog-input"
              />

              {/* Image Upload Section */}
              <Typography variant="subtitle1" className="upload-title">
                Featured Image
              </Typography>

              {!postImage ? (
                <Box
                  className={`image-upload-container ${
                    dragActive ? "drag-active" : ""
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="post-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="post-image" className="upload-label">
                    <CloudUploadIcon className="upload-icon" />
                    <Typography variant="body1">
                      Drag and drop an image here or click to browse
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Supports: JPG, PNG, GIF (Max: 5MB)
                    </Typography>
                  </label>
                </Box>
              ) : (
                <Box className="image-preview-container">
                  <img
                    src={postImage}
                    alt="Preview"
                    className="image-preview"
                  />
                  <IconButton
                    className="remove-image-button"
                    onClick={removeImage}
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}

              <TextField
                margin="dense"
                label="Content"
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                className="dialog-input"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" color="primary">
                Save as Draft
              </Button>
              <Button variant="contained" color="success">
                Publish
              </Button>
            </DialogActions>
          </>
        )}
        {dialogType === "edit" && selectedPost && (
          <>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Post Title"
                fullWidth
                variant="outlined"
                defaultValue={selectedPost.title}
                className="dialog-input"
              />
              <TextField
                margin="dense"
                label="Category"
                fullWidth
                variant="outlined"
                defaultValue={selectedPost.category}
                className="dialog-input"
              />

              {/* Image Upload Section - Same as in Add dialog */}
              <Typography variant="subtitle1" className="upload-title">
                Featured Image
              </Typography>

              {!postImage ? (
                <Box
                  className={`image-upload-container ${
                    dragActive ? "drag-active" : ""
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="post-image-edit"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <label htmlFor="post-image-edit" className="upload-label">
                    <CloudUploadIcon className="upload-icon" />
                    <Typography variant="body1">
                      Drag and drop an image here or click to browse
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Supports: JPG, PNG, GIF (Max: 5MB)
                    </Typography>
                  </label>
                </Box>
              ) : (
                <Box className="image-preview-container">
                  <img
                    src={postImage}
                    alt="Preview"
                    className="image-preview"
                  />
                  <IconButton
                    className="remove-image-button"
                    onClick={removeImage}
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}

              <TextField
                margin="dense"
                label="Content"
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                className="dialog-input"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button variant="contained" color="primary">
                Save as Draft
              </Button>
              <Button variant="contained" color="success">
                Update
              </Button>
            </DialogActions>
          </>
        )}

        {dialogType === "view" && selectedPost && (
          <>
           <Post post={selectedPost} />
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog("edit", selectedPost);
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}

        {dialogType === "delete" && selectedPost && (
          <>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the post "{selectedPost.title}"?
                This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseDialog}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
