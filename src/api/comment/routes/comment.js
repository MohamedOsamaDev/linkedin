module.exports = {
  routes: [
    {
      method: "POST",
      path: "/comments",
      handler: "comment.addComment",
    },
    {
      method: "GET",
      path: "/posts/:id/comments",
      handler: "comment.getComments",
    },
    {
      method: "PUT",
      path: "/comments/:id",
      handler: "comment.updateComment",
    },
    {
      method: "DELETE",
      path: "/comments/:id",
      handler: "comment.deleteComment",
    },
  ],
};
