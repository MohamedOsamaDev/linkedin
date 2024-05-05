const { handlePage } = require("../../../utils/handleQuery");
const { Createvalidation } = require("../../../utils/validation");
const { addLikeVal, deleteLikeVal, getlikesVal } = require("../schema/likeVal");

module.exports = {
  addLike: async (ctx) => {
    try {
      const { error } = await Createvalidation(addLikeVal, {
        id: ctx?.request?.params?.id,
      });
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { user } = ctx.state;
      const { id } = ctx.request.params;
      const post = await strapi.entityService.findOne("api::post.post", id);
      if (!post) return ctx.notFound("post not found");
      const isLikedBefore = await strapi.db
        .query("api::like.like")
        .findOne({ where: { user: user.id, post: id } });
      if (isLikedBefore) return ctx.badRequest("already liked");
      const data = await strapi.entityService.create("api::like.like", {
        data: {
          user: user.id,
          post: id,
        },
      });
      await strapi.entityService.update("api::post.post", post.id, {
        data: {
          likes: +post.likes + 1,
        },
      });
      return ctx.send({
        data: {
          message: "success",
        },
      });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  deleteLike: async (ctx) => {
    try {
      const { error } = await Createvalidation(deleteLikeVal, {
        id: ctx?.request?.params?.id,
      });
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { user } = ctx.state;
      const { id } = ctx.request.params;
      const like = await strapi.db.query("api::like.like").findOne({
        where: {
         post : id,
          user: user.id,
        },
        populate: true,
      });
      if (!like) return ctx.notFound("like not found");
      await strapi.entityService.delete("api::like.like", like?.id);
      await strapi.entityService.update("api::post.post", id, {
        data: {
          likes: +like.post.likes - 1 < 0 ? 0 : +like.post.likes - 1,
        },
      });
      return ctx.send({ data: "success" });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  getlikes: async (ctx) => {
    try {
      const { error } = await Createvalidation(getlikesVal, {
        id: ctx?.request?.params?.id,
      });
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { id } = ctx.params;
      let page = handlePage(ctx?.request?.query?.page);

      const likes = await strapi.entityService.findPage("api::like.like", {
        page,
        pageSize: 15,
        filters: { post: id },
        populate: {
          user: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url"],
          },
        },
      });
      return ctx.send({ data: likes });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
};
