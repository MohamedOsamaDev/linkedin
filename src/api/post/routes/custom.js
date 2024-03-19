module.exports = {
  routes: [
    {
      method: "POST",
      path: "/createpost",
      handler: "custom.createpost",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/get-posts",
      handler: "custom.findAllPosts",
    },
    {
      method: "GET",
      path: "/get-one-post",
      handler: "custom.findOnePost",
    },
    {
      method: "PUT",
      path: "/update-post",
      handler: "custom.updatePost",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/delete-post",
      handler: "custom.deletePost",
    },
  ],
};
