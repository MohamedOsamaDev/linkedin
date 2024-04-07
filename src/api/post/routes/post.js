module.exports = {
  routes: [
    {
      method: "POST",
      path: "/posts",
      handler: "post.createpost",
    },
    {
      method: "GET",
      path: "/posts",
      handler: "post.findAllPosts",
    },
    {
      method: "GET",
      path: "/posts/:id",
      handler: "post.findOnePost",
    },
    {
      method: "PUT",
      path: "/posts/:id",
      handler: "post.updatePost",
    },
    {
      method: "DELETE",
      path: "/posts/:id",
      handler: "post.deletePost",
    },
  ],
};
