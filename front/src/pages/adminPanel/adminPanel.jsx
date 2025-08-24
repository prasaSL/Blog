import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Tab,
  Tabs,
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
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";
import "./adminPanel.css";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Define the API base URL directly to avoid process.env issues
// Adjust this URL to match your API server if needed
const API_BASE_URL = window.location.origin.includes("localhost")
  ? "http://localhost:5000"
  : window.location.origin;

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

// Post Preview Component for the dialog
const PostPreview = ({ post, loading }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // Helper function to get image source based on different possible formats
  const getImageSource = (post) => {
    // First check if there's imageData with base64 data
    if (post.imageData && post.imageData.data) {
      return `data:${post.imageData.contentType || "image/png"};base64,${
        post.imageData.data
      }`;
    }

    // Then check if there's a featuredImage URL
    if (post.featuredImage) {
      return post.featuredImage.startsWith("http")
        ? post.featuredImage
        : `${API_BASE_URL}${post.featuredImage}`;
    }

    // Return null if no image is available
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Typography>No post data available</Typography>
      </Box>
    );
  }

  const imageSource = getImageSource(post);

  return (
    <Box className="post-preview">
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
          {post.User?.name?.charAt(0) || "U"}
        </Avatar>
        <Typography variant="body2" color="text.secondary">
          {post.User?.name || "Unknown"} •{" "}
          {formatDate(post.publishedAt || post.createdAt)}
        </Typography>
      </Box>

      {imageSource && (
        <Box mb={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={imageSource}
            alt={post.title}
            sx={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              borderRadius: 1,
              boxShadow: 1,
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "";
            }}
          />
        </Box>
      )}

      <Typography
        variant="body1"
        paragraph
        sx={{
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {post.content}
      </Typography>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Box>
          <Chip
            label={`${post.viewCount || 0} views`}
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip
            label={post.status}
            size="small"
            color={post.status === "published" ? "success" : "default"}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Last updated: {formatDate(post.updatedAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default function AdminPanel() {
  const [selectedMenu, setSelectedMenu] = useState("posts");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [editMode, setEditMode] = useState("content"); // 'content' or 'image'

  // API data state
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "published",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [singlePostLoading, setSinglePostLoading] = useState(false);
  const [singlePost, setSinglePost] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch posts when component mounts or when page/rowsPerPage/statusFilter changes
  useEffect(() => {
    fetchPosts();
  }, [page, rowsPerPage, statusFilter]); // Don't include searchTerm to prevent auto-search

  // Function to fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-based pagination, MUI uses 0-based
        limit: rowsPerPage,
      });

      // Add search term if provided
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      // Add status filter if not 'all'
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await api.get(`/posts/all-list?${params.toString()}`);

      if (response.data.success) {
        setPosts(response.data.data);
        setTotalPosts(
          response.data.pagination?.total || response.data.count || 0
        );
        setTotalPages(
          response.data.pagination?.totalPages ||
            Math.ceil((response.data.count || 0) / rowsPerPage)
        );
      } else {
        setError(response.data.message || "Failed to fetch posts");
      }
    } catch (err) {
      setError("Error fetching posts: " + (err.message || "Unknown error"));
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single post for viewing
  const fetchSinglePost = async (id) => {
    try {
      setSinglePostLoading(true);
      setSinglePost(null); // Clear any existing post data

      const response = await api.get(`/posts/${id}`);

      if (response.data.success) {
        setSinglePost(response.data.data);
      } else {
        showSnackbar("Failed to load post", "error");
      }
    } catch (err) {
      showSnackbar(`Error: ${err.message || "Could not load post"}`, "error");
      console.error("Error fetching post:", err);
    } finally {
      setSinglePostLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    setPage(0); // Reset to first page
    fetchPosts();
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(0); // Reset to first page
  };

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

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  // Table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit mode tabs handling
  const handleChangeEditMode = (event, newMode) => {
    setEditMode(newMode);
  };

  // Form input handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Dialog handlers
  const handleOpenDialog = (type, post = null) => {
    setDialogType(type);
    setSelectedPost(post);
    setOpenDialog(true);

    // Reset form state
    setFormErrors({});
    setPostImage(null);
    setEditMode("content"); // Reset to content tab

    if (type === "add") {
      setFormData({
        title: "",
        content: "",
        status: "published",
      });
    } else if (type === "edit" && post) {
      setFormData({
        title: post.title || "",
        content: post.content || "",
        status: post.status || "published",
      });
    } else if (type === "view" && post) {
      fetchSinglePost(post.id);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
    setPostImage(null);
    setFormData({
      title: "",
      content: "",
      status: "published",
    });
    setFormErrors({});
    setSinglePost(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create post
  const handleCreatePost = async (status) => {
    // Update status based on which button was clicked
    const postData = { ...formData, status };

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);

      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("title", postData.title);
      formDataObj.append("content", postData.content);
      formDataObj.append("status", postData.status);

      // Add image if selected
      if (postImage) {
        // Extract the base64 data from the data URL
        const base64Data = postImage.split(",")[1];
        // Convert base64 to blob
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(
          (r) => r.blob()
        );

        // Create a file from the blob
        const imageFile = new File([blob], "featured-image.jpg", {
          type: "image/jpeg",
        });
        formDataObj.append("featuredImage", imageFile);
      }

      const response = await api.post("/posts/create", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showSnackbar(
          `Post ${
            postData.status === "published" ? "published" : "saved as draft"
          } successfully`
        );
        handleCloseDialog();
        fetchPosts(); // Refresh post list
      } else {
        showSnackbar(response.data.message || "Failed to create post", "error");
      }
    } catch (err) {
      showSnackbar(`Error: ${err.message || "Failed to create post"}`, "error");
      console.error("Error creating post:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update post
  const handleUpdatePost = async (status) => {
    if (!selectedPost || !selectedPost.id) {
      showSnackbar("No post selected for update", "error");
      return;
    }

    // Update status based on which button was clicked
    const postData = { ...formData, status };

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);

      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("title", postData.title);
      formDataObj.append("content", postData.content);
      formDataObj.append("status", postData.status);

      // Add image if selected
      if (postImage) {
        // Extract the base64 data from the data URL
        const base64Data = postImage.split(",")[1];
        // Convert base64 to blob
        const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(
          (r) => r.blob()
        );

        // Create a file from the blob
        const imageFile = new File([blob], "featured-image.jpg", {
          type: "image/jpeg",
        });
        formDataObj.append("featuredImage", imageFile);
      }

      const response = await api.put(`/posts/${selectedPost.id}`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showSnackbar("Post updated successfully");
        handleCloseDialog();
        fetchPosts(); // Refresh post list
      } else {
        showSnackbar(response.data.message || "Failed to update post", "error");
      }
    } catch (err) {
      showSnackbar(`Error: ${err.message || "Failed to update post"}`, "error");
      console.error("Error updating post:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!selectedPost || !selectedPost.id) {
      showSnackbar("No post selected for deletion", "error");
      return;
    }

    try {
      setSubmitLoading(true);

      const response = await api.delete(`/posts/${selectedPost.id}`);

      if (response.data.success) {
        showSnackbar("Post deleted successfully");
        handleCloseDialog();
        fetchPosts(); // Refresh post list
      } else {
        showSnackbar(response.data.message || "Failed to delete post", "error");
      }
    } catch (err) {
      showSnackbar(`Error: ${err.message || "Failed to delete post"}`, "error");
      console.error("Error deleting post:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("Image size exceeds 5MB limit", "error");
        return;
      }

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

      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("Image size exceeds 5MB limit", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPostImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            <Avatar className="admin-avatar">
              {user?.name?.charAt(0) || "A"}
            </Avatar>
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
            <MenuItem onClick={handleLogout}>
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
            {[
              {
                text: "Dashboard",
                icon: <DashboardIcon />,
                value: "dashboard",
              },
              { text: "Blog Posts", icon: <ArticleIcon />, value: "posts" },
            ].map((item) => (
              <ListItem
                key={item.value}
                className={
                  selectedMenu === item.value
                    ? "menu-item-selected"
                    : "menu-item"
                }
                onClick={() => handleMenuClick(item.value)}
                component="div"
                sx={{ cursor: "pointer" }}
              >
                <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem
              className="menu-item logout-item"
              onClick={handleLogout}
              component="div"
              sx={{ cursor: "pointer" }}
            >
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
                    value={totalPosts || "0"}
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
                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <CircularProgress size={24} />
                              </TableCell>
                            </TableRow>
                          ) : error ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                <Alert severity="error">{error}</Alert>
                              </TableCell>
                            </TableRow>
                          ) : posts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} align="center">
                                No posts found
                              </TableCell>
                            </TableRow>
                          ) : (
                            posts.slice(0, 5).map((post) => (
                              <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>
                                  {formatDate(
                                    post.publishedAt || post.createdAt
                                  )}
                                </TableCell>
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
                                <TableCell>{post.viewCount}</TableCell>
                              </TableRow>
                            ))
                          )}
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
                      <ListItem
                        component="div"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleOpenDialog("add")}
                      >
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add New Post" />
                      </ListItem>
                      <ListItem component="div" sx={{ cursor: "pointer" }}>
                        <ListItemIcon>
                          <CommentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Moderate Comments" />
                      </ListItem>
                      <ListItem component="div" sx={{ cursor: "pointer" }}>
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
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearch}
                      sx={{ ml: 1 }}
                    >
                      Search
                    </Button>
                  </Box>
                  <Box className="filter-buttons">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleStatusFilter("all")}
                      color={statusFilter === "all" ? "primary" : "inherit"}
                    >
                      All
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleStatusFilter("published")}
                      color={
                        statusFilter === "published" ? "primary" : "inherit"
                      }
                    >
                      Published
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleStatusFilter("draft")}
                      color={statusFilter === "draft" ? "primary" : "inherit"}
                    >
                      Drafts
                    </Button>
                    <IconButton
                      onClick={fetchPosts}
                      size="small"
                      title="Refresh"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Box>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Views</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : posts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            No posts found
                          </TableCell>
                        </TableRow>
                      ) : (
                        posts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>{post.title}</TableCell>
                            <TableCell>
                              {post.User?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {formatDate(post.publishedAt || post.createdAt)}
                            </TableCell>
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
                            <TableCell>{post.viewCount}</TableCell>
                            <TableCell>
                              <Box className="action-buttons">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog("view", post)}
                                  title="View"
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog("edit", post)}
                                  title="Edit"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleOpenDialog("delete", post)
                                  }
                                  title="Delete"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalPosts}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </Container>
          )}
        </Box>
      </Box>

      {/* Dialogs for CRUD operations */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth={dialogType === "delete" ? "xs" : "md"}
      >
        {/* Add Post Dialog */}
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
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={submitLoading}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={formData.status}
                  label="Status"
                  name="status"
                  onChange={handleFormChange}
                  disabled={submitLoading}
                >
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>

              <Tabs
                value={editMode}
                onChange={handleChangeEditMode}
                sx={{ mt: 2, mb: 2, borderBottom: 1, borderColor: "divider" }}
              >
                <Tab value="content" label="Content" />
                <Tab value="image" label="Featured Image" />
              </Tabs>

              {editMode === "content" && (
                <TextField
                  margin="dense"
                  label="Content"
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  className="dialog-input"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  error={!!formErrors.content}
                  helperText={formErrors.content}
                  disabled={submitLoading}
                />
              )}

              {editMode === "image" && (
                <>
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
                      sx={{
                        border: "2px dashed #ccc",
                        p: 3,
                        borderRadius: 1,
                        textAlign: "center",
                        backgroundColor: dragActive
                          ? "rgba(0, 0, 0, 0.05)"
                          : "transparent",
                      }}
                    >
                      <input
                        type="file"
                        id="post-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        disabled={submitLoading}
                      />
                      <label
                        htmlFor="post-image"
                        style={{ cursor: "pointer", display: "block" }}
                      >
                        <CloudUploadIcon
                          sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                        />
                        <Typography variant="body1">
                          Drag and drop an image here or click to browse
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Supports: JPG, PNG, GIF (Max: 5MB)
                        </Typography>
                      </label>
                    </Box>
                  ) : (
                    <Box sx={{ position: "relative", mb: 2 }}>
                      <img
                        src={postImage}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                          border: "1px solid #eee",
                          borderRadius: "4px",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                          },
                        }}
                        onClick={removeImage}
                        size="small"
                        disabled={submitLoading}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={submitLoading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCreatePost("draft")}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save as Draft"
                )}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleCreatePost("published")}
                disabled={submitLoading}
              >
                {submitLoading ? <CircularProgress size={24} /> : "Publish"}
              </Button>
            </DialogActions>
          </>
        )}

        {/* Edit Post Dialog */}
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
                className="dialog-input"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={submitLoading}
              />

              <FormControl fullWidth margin="dense">
                <InputLabel id="edit-status-select-label">Status</InputLabel>
                <Select
                  labelId="edit-status-select-label"
                  id="edit-status-select"
                  value={formData.status}
                  label="Status"
                  name="status"
                  onChange={handleFormChange}
                  disabled={submitLoading}
                >
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>

              <Tabs
                value={editMode}
                onChange={handleChangeEditMode}
                sx={{ mt: 2, mb: 2, borderBottom: 1, borderColor: "divider" }}
              >
                <Tab value="content" label="Content" />
                <Tab value="image" label="Featured Image" />
              </Tabs>

              {editMode === "content" && (
                <TextField
                  margin="dense"
                  label="Content"
                  fullWidth
                  multiline
                  rows={8}
                  variant="outlined"
                  className="dialog-input"
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  error={!!formErrors.content}
                  helperText={formErrors.content}
                  disabled={submitLoading}
                />
              )}

              {editMode === "image" && (
                <>
                  <Typography variant="subtitle1" className="upload-title">
                    Current Featured Image
                  </Typography>

                  {(selectedPost.featuredImage ||
                    (selectedPost.imageData && selectedPost.imageData.data)) &&
                    !postImage && (
                      <Box sx={{ mb: 3, textAlign: "center" }}>
                        <Box
                          component="img"
                          src={
                            selectedPost.imageData &&
                            selectedPost.imageData.data
                              ? `data:${
                                  selectedPost.imageData.contentType ||
                                  "image/png"
                                };base64,${selectedPost.imageData.data}`
                              : selectedPost.featuredImage.startsWith("http")
                              ? selectedPost.featuredImage
                              : `${API_BASE_URL}${selectedPost.featuredImage}`
                          }
                          alt="Current featured image"
                          sx={{
                            maxHeight: "200px",
                            maxWidth: "100%",
                            objectFit: "contain",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            p: 1,
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "";
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          Current image will be preserved unless you upload a
                          new one
                        </Typography>
                      </Box>
                    )}

                  <Typography variant="subtitle1" className="upload-title">
                    {postImage ? "New Featured Image" : "Upload New Image"}
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
                      sx={{
                        border: "2px dashed #ccc",
                        p: 3,
                        borderRadius: 1,
                        textAlign: "center",
                        backgroundColor: dragActive
                          ? "rgba(0, 0, 0, 0.05)"
                          : "transparent",
                      }}
                    >
                      <input
                        type="file"
                        id="post-image-edit"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        disabled={submitLoading}
                      />
                      <label
                        htmlFor="post-image-edit"
                        style={{ cursor: "pointer", display: "block" }}
                      >
                        <CloudUploadIcon
                          sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                        />
                        <Typography variant="body1">
                          Drag and drop an image here or click to browse
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Supports: JPG, PNG, GIF (Max: 5MB)
                        </Typography>
                      </label>
                    </Box>
                  ) : (
                    <Box sx={{ position: "relative", mb: 2 }}>
                      <img
                        src={postImage}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxHeight: "300px",
                          objectFit: "contain",
                          border: "1px solid #eee",
                          borderRadius: "4px",
                        }}
                      />
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                          },
                        }}
                        onClick={removeImage}
                        size="small"
                        disabled={submitLoading}
                      >
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} disabled={submitLoading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUpdatePost("draft")}
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Save as Draft"
                )}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleUpdatePost("published")}
                disabled={submitLoading}
              >
                {submitLoading ? <CircularProgress size={24} /> : "Update"}
              </Button>
            </DialogActions>
          </>
        )}

        {/* View Post Dialog */}
        {dialogType === "view" && selectedPost && (
          <>
            <DialogTitle>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Post Preview</Typography>
                <IconButton size="small" onClick={handleCloseDialog}>
                  <CancelIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ padding: 3 }}>
              <PostPreview
                post={singlePost || selectedPost}
                loading={singlePostLoading}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog("edit", singlePost || selectedPost);
                }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}

        {/* Delete Post Dialog */}
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
              <Button onClick={handleCloseDialog} disabled={submitLoading}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeletePost}
                disabled={submitLoading}
              >
                {submitLoading ? <CircularProgress size={24} /> : "Delete"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
