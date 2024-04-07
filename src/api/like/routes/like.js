module.exports = {
  routes: [
    {
      method: "GET",
      path: "/likes/:id",
      handler: "like.getlikes",
    },
    {
      method: "POST",
      path: "/posts/:id/likes",
      handler: "like.addLike",
    },
    {
      method: "DELETE",
      path: "/likes/:id",
      handler: "like.deleteLike",
    },
  ],
};
