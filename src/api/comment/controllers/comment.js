module.exports = {
  addComment: async (ctx) => {
    const { user } = ctx.state;
    const { text, postId } = ctx.request.body;
    const post = await strapi.entityService.findOne("api::post.post", postId);
    if (!post) return ctx.badRequest("Post not found");

    await strapi.entityService.update("api::post.post", post.id, {
      data: {
        comments: +post.comments + 1,
      },
    });

    const comment = await strapi.entityService.create("api::comment.comment", {
      data: {
        text,
        user: user.id,
        post: postId,
      },
      populate: {
        user: {
          fields: ["fullName", "title"],
          populate: { profilePic: { fields: ["url"] } },
        },
        media: {
          fields: ["url"],
        },
      },
    });
    return ctx.send({ data: comment });
  },
  getComments: async (ctx) => {
    const { id } = ctx.request.params;
    let page =
      ctx?.request?.query?.page < 1 ? 1 : ctx?.request?.query?.page * 1 || 1;

    const comments = await strapi.entityService.findPage(
      "api::comment.comment",
      {
        post: id,
        page,
        pageSize: 15,
        populate: {
          user: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url"],
          },
        },
      }
    );
    return ctx.send({ data: comments });
  },
  updateComment: async (ctx) => {
    const { id } = ctx.request.params;
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
        populate: {
          user: {
            fields: ["fullName", "title"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url"],
          },
        },
      }
    );
    return ctx.send({ data: commentafterUpdate });
  },
  deleteComment: async (ctx) => {
    const { id } = ctx.request.params;
    const { user } = ctx.state;
    const comment = await strapi.entityService.findOne(
      "api::comment.comment",
      id,
      { populate: ["user", "post"] }
    );
    if (!comment) return ctx.badRequest("Comment not found");
    if (comment?.user?.id !== user.id)
      return ctx.badRequest("You are not the creator of this comment");
    await strapi.entityService.delete("api::comment.comment", id);
    await strapi.entityService.update("api::post.post", id, {
      data: {
        comments:
          +comment.post.comments - 1 < 0 ? 0 : +comment.post.comments - 1,
      },
    });
    return ctx.send({
      data: {
        massage: "success",
      },
    });
  },
};
