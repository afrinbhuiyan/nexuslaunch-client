import { useState, useEffect, useRef } from "react";
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Update Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              maxLength={500}
              className="w-full p-2 border rounded h-28"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Web App">Web App</option>
                <option value="Mobile App">Mobile App</option>
                <option value="SaaS">SaaS</option>
                <option value="Tool">Tool</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Pricing</label>
              <select
                name="pricing"
                value={formData.pricing}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <ReactTags
              ref={reactTagsRef}
              tags={tags}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              delimiters={delimiters}
              inputFieldPosition="inline"
              placeholder="Press enter to add tag"
              autocomplete
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">External Link</label>
            <input
              type="url"
              name="externalLink"
              value={formData.externalLink}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full p-2 border rounded"
              pattern="https?://.+"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Image</label>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="w-full p-2 border rounded"
            />
            {loading && <p className="text-blue-600 mt-1">Uploading...</p>}
            {imageURL && (
              <div className="mt-2">
                <img
                  src={imageURL}
                  alt="Preview"
                  className="h-40 object-contain"
                />
              </div>
            )}
          </div>

          <div className="p-3 bg-gray-50 border rounded">
            <h4 className="font-medium mb-2">Owner</h4>
            <div className="flex items-center gap-3">
              <img
                src={user?.photoURL}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p>{user?.displayName || "Anonymous"}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
