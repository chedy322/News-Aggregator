const { IMAGE_API, SECRET_API,CLOUD_NAME } = require('./variables');
const cloudinary = require('cloudinary').v2;

async function handle_image_upload(image_url,public_id) {
    // Configuration
    cloudinary.config({ 
        cloud_name: CLOUD_NAME, 
        api_key: IMAGE_API, 
        api_secret: SECRET_API 
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           image_url, {
               public_id: public_id,
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(public_id, {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(public_id, {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    return autoCropUrl
};

module.exports = { handle_image_upload };