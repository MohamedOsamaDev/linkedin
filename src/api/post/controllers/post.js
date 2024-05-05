const { handlePage, handleSort } = require("../../../utils/handleQuery");
const { Createvalidation } = require("../../../utils/validation");
const { createpostVal, findOnePostVal, updatePostVal, deletePostVal } = require("../schema/postVal");

module.exports = {
  createpost: async (ctx) => {
    try {
      const { error } = await Createvalidation(createpostVal, ctx.request.body);
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }  
      const { text } = ctx.request.body;
      if (!text &&  !ctx?.request?.files?.media) {
        return ctx.badRequest("Please add text or media");
      }
      const { user } = ctx.state;
      let uploadedFile = [];
      if (ctx?.request?.files?.media) {
        const { media } = ctx?.request?.files;
        uploadedFile = await strapi.service("plugin::upload.upload").upload({
          data: {
            fileInfo: { caption: "", alternativeText: "", name: "" },
          },
          files: media,
        });
      }
      const post = await strapi.entityService.create("api::post.post", {
        data: {
          text,
          creator: user.id,
          media: uploadedFile,
        },
        populate: {
          creator: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
        },
      });
      return ctx.send({ data: post });
    } catch (error) {
      console.log("🚀 ~ createpost: ~ error:", error)
      return ctx.badRequest(error);
    }
  },
  findAllPosts: async (ctx) => {
    try {
      const { user } = ctx.state;
      let page = handlePage(ctx?.request?.query?.page)
      let pageSize = handlePage(ctx?.request?.query?.pagesize,10)
      const data = await strapi.entityService.findPage("api::post.post", {
        page,
        sort: { id: handleSort(ctx?.request?.query?.sort) },
        pageSize,
        populate: {
          creator: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
          isLiked: { filters: { user: user.id } },
          related_comments: {
            populate: {
              user: {
                fields: ["fullName", "title", "username"],
                populate: { profilePic: { fields: ["url"] } },
              },
              post: {
                fields: ["id"],
              },
            },
            filters: {
              user: {
                connections: {
                  users: { id: { $in: [user.id] } },
                },
                id: { $not: user.id },
              },
            },

            start: 0,
            limit: 2,
          },
        },
      });
      data.results.forEach((post) => {
        // @ts-ignore
        post.isLiked = post.isLiked.length !== 0;
      });
      return ctx.send({ data });
    } catch (error) {
      console.log("🚀 ~ findAllPosts: ~ error:", error);
      return ctx.badRequest(error);
    }
  },
  findOnePost: async (ctx) => {
    try {
      const { error } = await Createvalidation(findOnePostVal, {id:ctx?.request?.params?.id});
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }  
      const { id } = ctx.request.params;
      const data = await strapi.entityService.findOne("api::post.post", id, {
        populate: {
          creator: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
        },
      });
      if (!data) {
        return ctx.badRequest("Post not found");
      }
      return ctx.send({ data });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  updatePost: async (ctx) => {
    try {
      console.log("🚀 ~ findOnePost: ~ ctx.request.params:", ctx.request.params)
      const { error } = await Createvalidation(updatePostVal, {...ctx.request.params, ...ctx.request.body});
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }  
      const { id } = ctx.request.params;
      const { text } = ctx.request.body;
      const post = await strapi.entityService.findOne("api::post.post", id,{
        populate: {
          creator: {
            fields: ["fullName", "title", "username"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
        },
      });
      if (!post) return ctx.badRequest("Post not found");
      if (post.creator.id !== ctx.state.user.id)
        return ctx.BadRequest("Invalid post");
      let data = { text };
      if (ctx?.request?.files?.media) {
        const { media } = ctx.request.files;
        const uploadedFile = await strapi
          .service("plugin::upload.upload")
          .upload({
            data: {
              fileInfo: { caption: "", alternativeText: "", name: "" },
            },
            files: media,
          });
        data = {
          ...data,
          media: uploadedFile,
        };
      }
      const postAfterUpdated = await strapi.entityService.update(
        "api::post.post",
        id,
        {
          data,
          populate: {
            creator: {
              fields: ["fullName", "title", "username"],
              populate: { profilePic: { fields: ["url"] } },
            },
            media: {
              fields: ["url", "mime", "provider_metadata"],
            },
          },
        }
      );
      return ctx.send({ data: postAfterUpdated });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  deletePost: async (ctx) => {
    try {
      const { error } = await Createvalidation(deletePostVal, {...ctx.request.params, ...ctx.request.body});
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }  
      const { user } = ctx.state;
      const { id } = ctx.request.params;
      const post = await strapi.entityService.findOne("api::post.post", id, {
        populate: {
          creator: {
            fields: ["id"],
          },
        },
      });
      if (post?.creator?.id !== user?.id)
        return ctx.badRequest("You can't delete this post");
      await strapi.entityService.delete("api::post.post", id);
      return ctx.send({ data: { massage: "success" } });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
};
