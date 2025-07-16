import React, { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { WithContext as ReactTags } from "react-tag-input";
import { uploadImageToImgBB } from "../../utils/imageUpload";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiX,
  FiUser,
  FiTag,
  FiLink,
  FiDollarSign,
  FiGrid,
} from "react-icons/fi";

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
  const [canAdd, setCanAdd] = useState(true);
  const reactTagsRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAddPermission = async () => {
      try {
        const subRes = await axiosSecure.get(
          `/api/users/subscription-status?email=${user.email}`
        );
        const isSubscribed = subRes.data?.isSubscribed;

        if (!isSubscribed) {
          const countRes = await axiosSecure.get(
            `/api/products/user-count?email=${user.email}`
          );
          const productCount = countRes.data.count || 0;

          if (productCount >= 1) {
            setCanAdd(false);
          }
        }
      } catch (err) {
        console.error("Permission check failed:", err);
        toast.error("Failed to check add permission.");
      }
    };

    if (user?.email) {
      checkAddPermission();
    }
  }, [user?.email, axiosSecure]);

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
      const { data } = await axiosSecure.post("/api/products/add", productData);
      toast.success("✅ Product submitted successfully!");
      formRef.current.reset();
      setImageURL("");
      setTags([]);
      navigate("/dashboard/my-products");
    } catch (error) {
      const msg = error.response?.data?.message;
      if (msg?.includes("Only one product")) {
        toast.error("You've used your free product slot. Please subscribe.");
        navigate("/dashboard/profile");
      } else {
        toast.error(msg || "❌ Failed to add product.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <p className="text-indigo-100 mt-1">
            Share your creation with the community
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Product Information Section */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiGrid className="mr-2 text-indigo-500" />
                Product Information
              </h3>
            </div>

            {/* Product Name */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Product Name *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    maxLength={100}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    placeholder="My Awesome Product"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Description *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                  defaultValue={""}
                  required
                  maxLength={500}
                  placeholder="Describe your product in detail..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Maximum 500 characters
                </p>
              </div>
            </div>

            {/* Category and Pricing */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Product Details
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category *
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="category"
                      name="category"
                      required
                      className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select category</option>
                      <option value="Web App">Web Application</option>
                      <option value="Mobile App">Mobile Application</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Tool">Developer Tool</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="pricing"
                    className="block text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pricing Model
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="pricing"
                      name="pricing"
                      className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                    </select>
                    <FiDollarSign className="pointer-events-none absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Tags *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div
                  className={`border ${
                    tags.length === 0 ? "border-red-300" : "border-gray-300"
                  } rounded-md p-2 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-colors`}
                >
                  <ReactTags
                    ref={reactTagsRef}
                    tags={tags}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    delimiters={delimiters}
                    inputFieldPosition="inline"
                    placeholder={
                      tags.length === 0
                        ? "Type and press enter to add tags..."
                        : "Add another tag..."
                    }
                    autocomplete={false}
                    allowDeleteFromEmptyInput={false}
                    minQueryLength={1}
                    maxLength={20}
                    classNames={{
                      tags: "flex flex-wrap gap-2 mb-1",
                      tagInput: "inline-block w-full",
                      tagInputField:
                        "block w-full p-1 border-0 focus:ring-0 focus:outline-none text-sm",
                      tag: "bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full flex items-center text-sm font-medium",
                      remove:
                        "ml-1.5 text-indigo-500 hover:text-indigo-700 cursor-pointer text-xs",
                      suggestions:
                        "absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200",
                      activeSuggestion: "bg-indigo-50",
                    }}
                  />
                </div>
                <p
                  className={`mt-1 text-xs ${
                    tags.length === 0 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {tags.length === 0
                    ? "⚠️ Please add at least one tag"
                    : "Add tags separated by comma, enter, or space"}
                </p>
                {tags.length > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    {tags.length} tag{tags.length !== 1 ? "s" : ""} added
                  </p>
                )}
              </div>
            </div>

            {/* External Link */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label
                htmlFor="externalLink"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                External Link
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <FiLink className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    name="externalLink"
                    id="externalLink"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                    placeholder="https://example.com"
                    pattern="https?://.+"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <label className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Product Image *
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {!imageURL ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload an image</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageUpload}
                            accept="image/*"
                            required
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      {loading && (
                        <div className="text-indigo-600 text-sm flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Uploading...
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="relative group">
                      <img
                        src={imageURL}
                        alt="Preview"
                        className="h-48 w-full object-contain rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setImageURL("")}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-gray-400 hover:text-gray-500 focus:outline-none group-hover:opacity-100 opacity-0 transition-opacity duration-200"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Image uploaded successfully
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 pb-3 mb-3">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FiUser className="mr-2 text-indigo-500" />
                Owner Information
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-white border border-gray-200 overflow-hidden">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Owner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-medium">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.displayName || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className={`ml-3 inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting || loading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Product"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
