module.exports = {
  addComment: async (ctx) => {
    const { user } = ctx.state;
    const { text, postId } = ctx.request.body;
    const post = await strapi.entityService.findOne("api::post.post", postId);
    if (!post) return ctx.badRequest("Post not found");
    const comment = await strapi.entityService.create("api::comment.comment", {
      data: {
        text,
        creator: user.id,
        post: postId,
      },
    });
    return ctx.send({ data: comment });
  },
  getComments: async (ctx) => {
    const { postId } = ctx.params;
    const post = await strapi.entityService.findOne("api::post.post", postId);
    if (!post) return ctx.badRequest("Post not found");
    const comments = await strapi.entityService.findPage(
      "api::comment.comment",
      {
        post: postId,
        page: ctx?.request?.query?.page || 1,
        pageSize: 15,
        populate: {
          user: {
            fields: ["username"],
            populate: { image: { fields: ["url"] } },
          },
        },
      }
    );
    return ctx.send({ data: comments });
  },
  updateComment: async (ctx) => {
    const { id } = ctx.params;
    const { text } = ctx.request.body;
    const { user } = ctx.state;
    const comment = await strapi.entityService.findOne(
      "api::comment.comment",
      id,
      { populate: ["user"] }
    );
    if (!comment) return ctx.badRequest("Comment not found");
    if (comment.user.id !== user.id)
      return ctx.badRequest("You are not the creator of this comment");
    let commentafterUpdate = await strapi.entityService.update(
      "api::comment.comment",
      id,
      {
        data: {
          text,
        },
      }
    );
    return ctx.send({ data: commentafterUpdate });
  },
  deleteComment: async (ctx) => {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const comment = await strapi.entityService.findOne(
      "api::comment.comment",
      id,
      { populate: ["user"] }
    );
    if (!comment) return ctx.badRequest("Comment not found");
    if (comment.user.id !== user.id)  return ctx.badRequest("You are not the creator of this comment");
    await strapi.entityService.delete("api::comment.comment", id);
    return ctx.send({ data: comment });
  },
};
