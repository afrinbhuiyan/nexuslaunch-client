import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { WithContext as ReactTags } from "react-tag-input";
import useAuth from "../../hooks/useAuth";
import { uploadImageToImgBB } from "../../utils/imageUpload";

const delimiters = [188, 13]; // comma, enter

const UpdateProductModal = ({ product, onClose, onUpdate }) => {
  const { user } = useAuth();
  const reactTagsRef = useRef(null);

  const [tags, setTags] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Web App",
    pricing: "Free",
    externalLink: "",
  });

  // Pre-fill form when modal opens
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "Web App",
        pricing: product.pricing || "Free",
        externalLink: product.externalLink || "",
      });

      setTags(
        product.tags?.map((tag, index) => ({
          id: index.toString(),
          text: tag,
        })) || []
      );

      setImageURL(product.image || "");
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (i) => {
    setTags(tags.filter((_, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = [...tags];
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const url = await uploadImageToImgBB(file);
      setImageURL(url);
    } catch (err) {
      Swal.fire("Upload Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageURL) {
      Swal.fire("Image Required", "Please upload a product image", "warning");
      return;
    }

    const updatedData = {
      ...formData,
      tags: tags.map((tag) => tag.text),
      image: imageURL,
    };

    try {
      await onUpdate(updatedData);
      onClose();
      Swal.fire("Updated!", "Product updated successfully", "success");
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error!", "Failed to update product", "error");
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#6055f2] to-[#7b4ff2] p-6 text-white">
          <div className="flex justify-between items-center">
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-bold"
            >
              Update Product
            </motion.h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex mt-4 border-b border-[#7b4ff2]">
            {['basic', 'details', 'media'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-[#c4b9ff]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'basic' && 'Basic Info'}
                {tab === 'details' && 'Details'}
                {tab === 'media' && 'Media'}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6055f2] focus:border-[#6055f2] transition"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6055f2] focus:border-[#6055f2] transition"
                      >
                        <option value="Web App">Web App</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="SaaS">SaaS</option>
                        <option value="Tool">Tool</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      maxLength={500}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6055f2] focus:border-[#6055f2] transition h-32"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pricing Model
                      </label>
                      <select
                        name="pricing"
                        value={formData.pricing}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6055f2] focus:border-[#6055f2] transition"
                      >
                        <option value="Free">Free</option>
                        <option value="Freemium">Freemium</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        External Link
                      </label>
                      <input
                        type="url"
                        name="externalLink"
                        value={formData.externalLink}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6055f2] focus:border-[#6055f2] transition"
                        pattern="https?://.+"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="border border-gray-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-[#6055f2] focus-within:border-[#6055f2] transition">
                      <ReactTags
                        ref={reactTagsRef}
                        tags={tags}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        delimiters={delimiters}
                        inputFieldPosition="inline"
                        placeholder="Type and press enter to add tag"
                        autocomplete
                        classNames={{
                          tags: "flex flex-wrap gap-2",
                          tagInput: "inline-block",
                          tagInputField: "px-2 py-1 border-0 focus:outline-none focus:ring-0",
                          tag: "bg-[#6055f2]/10 text-[#6055f2] px-3 py-1 rounded-full flex items-center",
                          remove: "ml-2 text-[#6055f2] hover:text-[#7b4ff2]",
                          suggestions: "absolute z-10 bg-white shadow-lg rounded-md mt-1 w-full",
                          activeSuggestion: "bg-[#6055f2]/10",
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Add relevant tags to help users discover your product
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div
                  key="media"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image
                    </label>
                    <div className="flex items-center gap-4">
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6055f2] transition"
                      >
                        {loading ? (
                          <div className="flex flex-col items-center justify-center p-4 text-gray-500">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="h-8 w-8 border-4 border-[#6055f2] border-t-transparent rounded-full mb-2"
                            />
                            Uploading...
                          </div>
                        ) : (
                          <>
                            <input
                              type="file"
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="mt-2 text-sm text-gray-600">
                              Click to upload
                            </span>
                          </>
                        )}
                      </motion.label>
                      {imageURL && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative group"
                        >
                          <img
                            src={imageURL}
                            alt="Preview"
                            className="h-40 rounded-lg object-cover shadow-md"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => setImageURL("")}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="font-medium text-gray-700 mb-3">Owner</h4>
                    <div className="flex items-center gap-4">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={user?.photoURL}
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.displayName || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <div className="flex space-x-2">
            {['basic', 'details', 'media'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-3 h-3 rounded-full ${
                  activeTab === tab ? 'bg-[#6055f2]' : 'bg-gray-300'
                }`}
                aria-label={`Go to ${tab} tab`}
              />
            ))}
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-[#6055f2] to-[#7b4ff2] text-white rounded-lg font-medium hover:from-[#6055f2]/90 hover:to-[#7b4ff2]/90 transition shadow-md"
            >
              Update Product
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UpdateProductModal;