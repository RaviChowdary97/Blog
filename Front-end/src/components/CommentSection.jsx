import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "../components/Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, seComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const navigate = useNavigate();
  console.log(comments);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        seComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="">
          You must be signed in to comment.
          <Link to="/sign-in" style={{ color: "blue", marginLeft: "5px" }}>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment...."
            row="3"
            maxLength="200"
            onChange={(e) => seComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters remaining
            </p>
            <button
              type="submit"
              style={{
                backgroundColor: "purple",
                color: "#FFFFFF",
                padding: "5px 10px",
                borderRadius: "10px",
              }}
            >
              Submit
            </button>
          </div>
          {commentError && <Alert>{commentError}</Alert>}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments Yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 pu-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
        style={{
          margin: " auto",
          width: "495px",
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center  " style={{ height: "150px" }}>
            <HiOutlineExclamationCircle
              className="h-14 w-14 text-gray-400 dark:text-gray-200
              mt-2"
              style={{ marginLeft: "160px" }}
            />
            <h3 style={{ width: "400px" }}>
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-bold  rounded"
                style={{ marginTop: "20px" }}
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I'm sure
              </Button>
              <Button
                style={{ marginTop: "20px" }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold  rounded"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
