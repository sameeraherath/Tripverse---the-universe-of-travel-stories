import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";
import { Sparkles } from "lucide-react";

const PostForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(
    initialData?.images || []
  );

  // Sync incoming initialData (useful when it is loaded async in Edit page)
  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || "");
    setContent(initialData.content || "");

    // Normalize tags: ensure an array of strings
    const normalizeTags = (t) => {
      if (!t) return [];
      if (Array.isArray(t)) return t;
      if (typeof t === "string") {
        try {
          const parsed = JSON.parse(t);
          if (Array.isArray(parsed)) return parsed;
          // eslint-disable-next-line no-unused-vars
        } catch (_) {
          // fallback to comma-separated list
          return t
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      return [];
    };

    setTags(normalizeTags(initialData.tags));

    // Normalize existing images: array or JSON string
    const normalizeImages = (imgs) => {
      if (!imgs) return [];
      if (Array.isArray(imgs)) return imgs;
      if (typeof imgs === "string") {
        try {
          const parsed = JSON.parse(imgs);
          if (Array.isArray(parsed)) return parsed;
          // eslint-disable-next-line no-unused-vars
        } catch (_) {
          return [];
        }
      }
      return [];
    };

    setExistingImages(normalizeImages(initialData.images));
  }, [initialData]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // AI Assistance Functions

  const handleFixGrammar = async () => {
    if (!content.trim()) {
      alert("Please write some content first before fixing grammar mistakes.");
      return;
    }

    setGenerating(true);

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/fix-grammar`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.content) {
        setContent(response.data.content);
      }

      if (response.data.warning) {
        console.warn("AI grammar check warning:", response.data.warning);
        // You could show a toast notification here if you have a toast system
      }

      if (response.data.error) {
        console.warn("AI grammar check error:", response.data.error);
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error fixing grammar:", error);
      alert("Failed to fix grammar. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 3) {
      alert("You can only upload a maximum of 3 images");
      return;
    }

    setImages([...images, ...files]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      alert("Please enter a title for your post");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    setLoading(true); // Set loading to true when the form is submitted

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("tags", JSON.stringify(tags));

    // Append existing images (for edit mode)
    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    // Append new images
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // Only call the onSubmit function passed as a prop
      await onSubmit(formData); // Assuming onSubmit is an async function
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after form submission
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6 space-y-8 relative">
        {/* Title Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            Post Title
          </label>
          <input
            type="text"
            placeholder="Enter an engaging title for your post..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 placeholder-gray-500 transition-all duration-200 text-lg font-medium relative z-20"
          />
        </div>

        {/* Tags Section */}
        <div className="space-y-3 relative z-20">
          <label className="block text-sm font-semibold text-gray-800">
            Tags
          </label>
          <div className="bg-gray-50 rounded-xl p-4">
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            Content
          </label>
          <div className="bg-gray-50 rounded-xl p-4">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your amazing blog post..."
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            Images{" "}
            <span className="text-gray-500 font-normal">(Maximum 3)</span>
          </label>

          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            {/* Display existing images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={img}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-32 sm:h-28 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Display newly selected images */}
            {images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 sm:h-28 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* File input - only show if less than 3 images */}
            {existingImages.length + images.length < 3 && (
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors duration-200">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  accept="image/*"
                  multiple
                />
                <div className="space-y-2 pointer-events-none">
                  <div className="text-gray-400">
                    <svg
                      className="mx-auto h-12 w-12"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 text-center">
              {existingImages.length + images.length} of 3 images selected
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            className="flex-1 p-4 bg-white border-2 border-primary text-primary font-semibold focus:outline-none rounded-xl hover:bg-primary hover:text-white transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-3 shadow-sm"
            onClick={handleFixGrammar}
            disabled={loading || generating}
          >
            <Sparkles className="w-5 h-5" />
            {generating ? "AI is helping..." : "Fix Mistakes with AI"}
          </button>

          <button
            type="submit"
            className="flex-1 p-4 bg-gradient-primary text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default PostForm;
