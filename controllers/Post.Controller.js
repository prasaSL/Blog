const Post = require('../models/Post.model');
const  User = require('../models/User.model');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');




// Helper function to handle file uploads
const handleImageUpload = async (file, folder = 'posts') => {
  try {
    // Create a unique file name
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
    
    // Set upload path
    const uploadPath = path.join(__dirname, `../public/uploads/${folder}`, fileName);
    
    // Move the file
    await file.mv(uploadPath);
    
    // Return the relative path to store in database
    return `/uploads/${folder}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper to delete old image
const deleteOldImage = (imagePath) => {
  if (!imagePath || imagePath === 'default-post.jpg') return;
  
  const fullPath = path.join(__dirname, '../public', imagePath);
  
  // Check if file exists before attempting to delete
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// Create a new post with image upload
exports.createPost = async (req, res,next) => {
  try {
    console.log('Request body:', req);
    const { title, content, status } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content'
      });
    }
    
    // Create post data object
    const postData = {
      title,
      content,
      status: status || 'draft',
      userId: req.user.id 
    };
    
    // Handle image upload if present
    if (req.files && req.files.featuredImage) {
      const imagePath = await handleImageUpload(req.files.featuredImage);
      postData.featuredImage = imagePath;
    }
    
    // Create post in database
    const post = await Post.create(postData);
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    next(error);
  }
};

// Update post with image upload
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, content, categoryId, excerpt, status } = req.body;
    
    // Find the post
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check ownership
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Update post data
    const updateData = {
      title: title || post.title,
      content: content || post.content,
      categoryId: categoryId || post.categoryId,
      excerpt: excerpt || post.excerpt,
      status: status || post.status
    };
    
    // Handle image upload if present
    if (req.files && req.files.featuredImage) {
      // Delete old image first
      deleteOldImage(post.featuredImage);
      
      // Upload new image
      const imagePath = await handleImageUpload(req.files.featuredImage);
      updateData.featuredImage = imagePath;
    }
    
    // Update post
    await post.update(updateData);
    
    // Fetch updated post with associations
    const updatedPost = await Post.findByPk(postId, {
      include: [{ model: User, attributes: ['id', 'name', 'email'] }]
    });
    
    res.status(200).json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    next(error);
  }
};

// Delete post with image
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Find the post
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check ownership or admin rights
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }
    
    // Delete the associated image
    deleteOldImage(post.featuredImage);
    
    // Delete the post
    await post.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting post'
    });
  }
};






// Get all posts
exports.getUserPosts = async (req, res, next) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Get filter parameters
    const { search } = req.query;
    
    // Build where clause - always filter by published status
    const whereClause = {
      status: "published"  // This ensures only published posts are returned
    };
    
    // Add search criteria if provided (will be combined with status using AND)
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get total count for pagination metadata
    const totalCount = await Post.count({ where: whereClause });
    
    // Get posts with pagination
    const posts = await Post.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    // Format posts with image data
    const formattedPosts = posts.map(post => {
      const postJSON = post.toJSON();
      
      // Add image data to the post
      if (post.featuredImage) {
        postJSON.imageData = getImageData(post.featuredImage);
      }
      
      return postJSON;
    });
    
    // Send response with pagination data
    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        hasNextPage: offset + posts.length < totalCount,
        hasPrevPage: page > 1
      },
      data: formattedPosts
    });
  } catch (error) {
    // Pass error to the error handler middleware
    next(error);
  }
};



// Get single post
exports.getPost = async (req, res,next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: [ 'name'] }]
    });
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

      // Increment view count
    await post.increment('viewCount');
    
    // Convert to plain object
    const postJSON = post.toJSON();
    
    // Add image data to the post
    if (post.featuredImage) {
      postJSON.imageData = getImageData(post.featuredImage);
    }
    
    res.status(200).json({
      success: true,
      data: postJSON
    });
  } catch (error) {
    next(error);
  }
};


const getImageData = (imagePath) => {
  try {
    // Set default image path if none provided
    if (!imagePath || imagePath === 'default-post.jpg') {
      imagePath = path.join(__dirname, '../public/uploads/posts/default-post.jpg');
    } else {
      // Remove leading slash if present
      if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1);
      }
      imagePath = path.join(__dirname, '../public', imagePath);
    }
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.warn(`Image not found: ${imagePath}`);
      return null;
    }
    
    // Read the file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Get mime type based on extension
    const extension = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/jpeg'; // default
    
    if (extension === '.png') mimeType = 'image/png';
    if (extension === '.gif') mimeType = 'image/gif';
    if (extension === '.svg') mimeType = 'image/svg+xml';
    if (extension === '.webp') mimeType = 'image/webp';
    
    return {
      data: base64Image,
      contentType: mimeType,
      size: imageBuffer.length
    };
  } catch (error) {
    console.error('Error reading image:', error);
    return null;
  }
};


exports.getAllPosts = async (req, res, next) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    
    // Get filter parameters
    const { status,search } = req.query;
    
    // Build where clause
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Get total count for pagination metadata
    const totalCount = await Post.count({ where: whereClause });
    
    // Get posts with pagination
    const posts = await Post.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    // Send response with pagination data
    res.status(200).json({
      success: true,
      count: posts.length,
      pagination: {
        total: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        hasNextPage: offset + posts.length < totalCount,
        hasPrevPage: page > 1
      },
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    next(error);
  }
};