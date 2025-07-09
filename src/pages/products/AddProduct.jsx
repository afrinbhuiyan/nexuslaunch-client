import React, { useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import { WithContext as ReactTags } from "react-tag-input";
import useAuth from "../../hooks/useAuth";
import { uploadImageToImgBB } from "../../utils/imageUpload";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const KeyCodes = {
  comma: 188,
  enter: 13,
  space: 32,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [tags, setTags] = useState([]);
  const reactTagsRef = useRef(null);
  const formRef = useRef(null);

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return toast.error("Please select an image.");
    if (imageFile.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 5MB");
    }

    setLoading(true);
    try {
      const url = await uploadImageToImgBB(imageFile);
      setImageURL(url);
      toast.success("✅ Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("❌ Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback((i) => {
    setTags((prevTags) => {
      const newTags = prevTags.filter((_, index) => index !== i);
      setTimeout(() => {
        reactTagsRef.current?.textInput?.focus();
      }, 0);
      return newTags;
    });
  }, []);

  const handleAddition = useCallback((tag) => {
    if (tag.text.length > 20) {
      toast.error("Tag must be less than 20 characters");
      return;
    }
    setTags((prevTags) => [...prevTags, tag]);
  }, []);

  const handleDrag = useCallback((tag, currPos, newPos) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];
      newTags.splice(currPos, 1);
      newTags.splice(newPos, 0, tag);
      return newTags;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageURL) return toast.error("⚠️ Please upload an image first!");
    if (tags.length === 0) return toast.error("⚠️ Please add at least one tag");

    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name").trim(),
      description: formData.get("description").trim(),
      tags: tags.map((tag) => tag.text.trim()),
      externalLink: formData.get("externalLink")?.trim() || null,
      category: formData.get("category"),
      pricing: formData.get("pricing"),
      image: imageURL,
      upvotes: 0,
      owner: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
      },
      status: "pending",
      timestamp: new Date(),
    };

    setIsSubmitting(true);
    try {
      const { data } = await axiosSecure.post("api/products/add", productData);
      console.log(data)
      if (data.success) {
        toast.success("🎉 Product added successfully!");
        formRef.current?.reset();
        setTags([]);
        setImageURL("");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "❌ Failed to add product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Product Name *</label>
            <input
              name="name"
              type="text"
              required
              maxLength={100}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description *</label>
            <textarea
              name="description"
              required
              maxLength={500}
              className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Category *</label>
              <select
                name="category"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="Web App">Web Application</option>
                <option value="Mobile App">Mobile Application</option>
                <option value="SaaS">SaaS</option>
                <option value="Tool">Developer Tool</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Pricing Model</label>
              <select 
                name="pricing" 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tags *</label>
            <div className="border rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
              <ReactTags
                ref={reactTagsRef}
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={delimiters}
                inputFieldPosition="inline"
                placeholder="Type and press enter to add"
                autocomplete={false}
                allowDeleteFromEmptyInput={false}
                minQueryLength={1}
                maxLength={20}
                classNames={{
                  tags: "flex flex-wrap gap-2 mb-2",
                  tagInput: "w-full",
                  tag: "bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center",
                  remove: "ml-1 text-blue-500 hover:text-blue-700 cursor-pointer",
                  suggestions: "absolute z-10 bg-white border rounded shadow-lg mt-1 w-full",
                  activeSuggestion: "bg-blue-50",
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Add at least one tag (comma, enter, or space separated)
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">External Link</label>
            <input
              name="externalLink"
              type="url"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
              pattern="https?://.+"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Image *</label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              required
              className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {loading && (
              <div className="mt-2 text-blue-500 flex items-center">
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Uploading image...
              </div>
            )}
            {imageURL && (
              <div className="mt-2">
                <img
                  src={imageURL}
                  alt="Preview"
                  className="h-40 object-contain border rounded"
                />
                <button
                  type="button"
                  onClick={() => setImageURL("")}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Owner Information */}
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-medium mb-2">Owner Information</h3>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Owner" className="object-cover" />
                ) : (
                  <div className="bg-gray-300 text-gray-600 flex items-center justify-center text-lg font-medium">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="font-medium">{user.displayName || "Unknown User"}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            isSubmitting || loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Submitting...
            </span>
          ) : (
            "Submit Product"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;