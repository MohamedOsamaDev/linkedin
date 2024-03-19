module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-comment",
      handler: "custom.addComment",
    },
    {
      method: "GET",
      path: "/get-comments",
      handler: "custom.getComments",
    },
    {
      method: "PUT",
      path: "/update-comment",
      handler: "custom.updateComment",
    },
    {
      method: "DELETE",
      path: "/delete-comment",
      handler: "custom.deleteComment",
    },
  ],
};
