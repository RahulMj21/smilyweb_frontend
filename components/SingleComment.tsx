import React from "react";
import { userInterface } from "../slices/userSlice";

const SingleComment = ({
  comment,
  user,
}: {
  comment: { user: string; name: string; comment: string };
  user: userInterface;
}) => {
  return (
    <div className="comment">
      <p className="userName">
        {comment.user === user._id ? "You" : comment.name}
      </p>
      <p className="userSeperator">:</p>
      <p className="userComment">{comment.comment}</p>
    </div>
  );
};

export default SingleComment;
