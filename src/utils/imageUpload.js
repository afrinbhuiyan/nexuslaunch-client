export const uploadImageToImgBB = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('Image upload failed');
  }
};