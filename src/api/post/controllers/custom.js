module.exports = {
  createpost: async (ctx) => {
    try {
      const { user } = ctx.state;
      const { text } = ctx.request.body;
      let uploadedFile = [];
      if (ctx?.request?.files) {
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
            fields: ["fullName", "title"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
        },
      });
      return ctx.send({ data: post });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  findAllPosts: async (ctx) => {
    try {
      let page =
        ctx?.request?.query?.page < 1 ? 1 : ctx?.request?.query?.page * 1 || 1;

      const data = await strapi.entityService.findPage("api::post.post", {
        page,
        pageSize: 15,
        populate: {
          creator: {
            fields: ["fullName", "title"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
        },
      });
      return ctx.send({ data });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  findOnePost: async (ctx) => {
    try {
      const { id } = ctx.params;
      const data = await strapi.entityService.findOne("api::post.post", id, {
        populate: {
          creator: {
            fields: ["fullName", "title"],
            populate: { profilePic: { fields: ["url"] } },
          },
          media: {
            fields: ["url", "mime", "provider_metadata"],
          },
        },
      });
      return ctx.send({ data });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  updatePost: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { text } = ctx.request.body;
      const post = await ctx.entityService.findOne("api::post.post", id);
      if (!post) return ctx.badRequest("Post not found");
      if (post.creator.id !== ctx.state.user.id)
        return ctx.BadRequest("Invalid post");
      let data = { text };
      if (ctx.request.files) {
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
              fields: ["fullName", "title"],
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
      const { user } = ctx.state;
      const { id } = ctx.params;
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
