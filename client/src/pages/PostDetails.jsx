import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostComments,
  clearComments,
} from "../features/comments/commentsSlice";
import Comment from "../components/Comment";
import CommentForm from "../components/CommentForm";
import FollowButton from "../components/FollowButton";
import BookmarkButton from "../components/BookmarkButton";
import ImageSlideshow from "../components/ImageSlideshow";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../utils/api";
import { toast } from "react-toastify";
import {
  Share2,
  Edit2,
  Trash2,
  Calendar,
  Heart,
  MessageCircle,
  ArrowLeft,
  Flag,
} from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const dispatch = useDispatch();
  const { comments, isLoading: commentsLoading } = useSelector(
    (state) => state.comments
  );

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/posts/${id}`);

        setPost(response.data);
        dispatch(getPostComments(id));

        if (response.data.author) {
          const profileResponse = await api.get(
            `/api/profile/user/${response.data.author._id}`
          );
          setAuthorProfile(profileResponse.data);
        }

        const token = localStorage.getItem("authToken");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUserId(decodedToken.userId);
        }

        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error fetching post details"
        );
        setLoading(false);
      }
    };

    fetchPostDetails();
    return () => {
      dispatch(clearComments());
    };
  }, [id, dispatch]);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/posts/${id}`);
      setShowDeleteDialog(false);
      toast.success("Post deleted successfully!");
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      console.error("Error deleting post:", error);
      setIsDeleting(false);
      setShowDeleteDialog(false);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleReportClick = () => {
    setShowReportDialog(true);
  };

  const handleReportCancel = () => {
    setShowReportDialog(false);
  };

  const handleReportConfirm = async () => {
    setIsReporting(true);
    try {
      // This endpoint doesn't exist yet.
      // `POST /api/posts/:id/report` endpoint
      await api.post(`/api/posts/${id}/report`, {
        reason: "Wrong content",
      });
      toast.success(
        "Post reported successfully. Our moderators will review it."
      );
    } catch (error) {
      console.error("Error reporting post:", error);
      toast.error(error.response?.data?.message || "Failed to report post.");
    } finally {
      setIsReporting(false);
      setShowReportDialog(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100),
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Post
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-gradient-primary text-white rounded-full border border-gray-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The post you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2 bg-gradient-primary text-white rounded-full border border-gray-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white pt-20 pb-16 md:py-24">
      <div className="container max-w-4xl mx-auto px-3 md:px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Posts
        </button>

        {/* Main Content Card */}
        <article className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          {/* Featured Images Slideshow */}
          {post.images && post.images.length > 0 ? (
            <ImageSlideshow images={post.images} />
          ) : (
            post.image && (
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )
          )}

          <div className="p-4 md:p-8 lg:p-12">
            {/* Author Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <Link
                to={`/profile/${post.author?._id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {authorProfile?.avatar ? (
                  <img
                    src={authorProfile.avatar}
                    alt={authorProfile.name || "Author"}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-orange-200"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white text-lg md:text-xl font-bold">
                    {authorProfile?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">
                    {authorProfile ? authorProfile.name : "Unknown User"}
                  </p>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                {userId && post.author && userId === post.author._id ? (
                  <>
                    <Link
                      to={`/edit/${id}`}
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs md:text-sm"
                    >
                      <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs md:text-sm"
                    >
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </>
                ) : (
                  post.author?._id && (
                    <>
                      <FollowButton
                        userId={post.author._id}
                        variant="compact"
                      />
                      <button
                        onClick={handleReportClick}
                        className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-medium text-xs md:text-sm"
                      >
                        <Flag className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Report</span>
                      </button>
                    </>
                  )
                )}
                <BookmarkButton postId={id} variant="icon-only" />
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs md:text-sm"
                >
                  <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Stats */}
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">
                  {post.likeCount || 0} likes
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">
                  {comments.length} comments
                </span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-100">
                <span className="text-xs md:text-sm font-medium text-gray-500">
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 md:px-3 py-1 bg-orange-50 text-orange-600 text-xs md:text-sm font-medium rounded-full hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-sm md:prose-lg max-w-none mb-8 md:mb-12 rich-text-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-6 md:mt-8 bg-white rounded-2xl p-4 md:p-8 lg:p-12 border border-gray-200">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <MessageCircle className="w-5 h-5 md:w-8 md:h-8 text-primary" />
            Comments ({comments.length})
          </h2>

          <div className="mb-6 md:mb-8">
            <CommentForm postId={id} />
          </div>

          {commentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone and all comments will be permanently removed."
        confirmText="Delete Post"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Report Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showReportDialog}
        onClose={handleReportCancel}
        onConfirm={handleReportConfirm}
        title="Report Post"
        message="Are you sure you want to report this post for inappropriate content? This will submit it for review by our moderation team."
        confirmText="Report"
        cancelText="Cancel"
        isLoading={isReporting}
      />
    </div>
  );
};

export default PostDetails;
