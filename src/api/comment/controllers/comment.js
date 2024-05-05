const { Createvalidation } = require("../../../utils/validation");
const { addCommentVal, updateCommentVal, deleteCommentVal } = require("../schama/commentVal");

module.exports = {
  addComment: async (ctx) => {
    const { user } = ctx.state;
    const { error } = await Createvalidation(addCommentVal, ctx.request.body);
    if (error) {
      return ctx.badRequest(error.details[0].message);
    }
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
    let sort = ctx?.request?.query?.sort || "ASC";

    let pageSize =
      ctx?.request?.query?.pageSize < 1
        ? 5
        : ctx?.request?.query?.pageSize * 1 || 5;

    const comments = await strapi.entityService.findPage(
      "api::comment.comment",
      {
        page,
        pageSize,
        populate: {
          user: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url"],
          },
        },
        filters: {
          post: id,
        },
        sort: {
          createdAt: sort,
        },
      }
    );
    return ctx.send({ data: comments });
  },
  updateComment: async (ctx) => {
    try {
      const { error } = await Createvalidation(updateCommentVal, {id:ctx.request.params.id,...ctx.request.body});
    if (error) {
      return ctx.badRequest(error.details[0].message);
    }


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
    } catch (error) {
      return ctx.badRequest(error); 
    }
  },
  deleteComment: async (ctx) => {
    const { error } = await Createvalidation(deleteCommentVal, {...ctx.request.params});
    if (error) {
      return ctx.badRequest(error.details[0].message);
    }
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
    await strapi.entityService.update("api::post.post", comment?.post?.id, {
      data: {
        comments:+comment.post.comments - 1 < 0 ? 0 : +comment.post.comments -1
         
      },
    });
    return ctx.send({
      data: {
        massage: "success",
      },
    });
  },
};
