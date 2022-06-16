import React from "react";
import { Comment } from "../slices/postSlice";
import { userInterface } from "../slices/userSlice";

const SingleComment = ({
  comment,
  user,
}: {
  comment: Comment;
  user: userInterface;
}) => {
  return (
    <div className="comment">
      <p className="userName">
        {comment.user._id === user._id ? "You" : comment.user.name}
      </p>
      <p className="userSeperator">:</p>
      <p className="userComment">{comment.comment}</p>
    </div>
  );
};

export default SingleComment;
