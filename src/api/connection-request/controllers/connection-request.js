const { handlePage } = require("../../../utils/handleQuery");
const { Createvalidation } = require("../../../utils/validation");
const {
  requestForConnectionVal,
  acceptConnectionVal,
  deleteConnectionRequsetVal,
} = require("../schema/connectionRequestVal");

module.exports = {
  GetMyConnectionRequsetsSent: async (ctx) => {
    try {
      const { user } = ctx.state;
      let page = handlePage(ctx?.request?.query?.page);
      let pageSize = handlePage(ctx?.request?.query?.pageSize, 15);
      const data = await strapi.entityService.findPage(
        "api::connection-request.connection-request",
        {
          page,
          pageSize,
          filters: {
            from: user.id,
          },
          populate: {
            to: {
              fields: ["fullName", "title", "username"],
              populate: { profilePic: { fields: ["url"] } },
            },
          },
        }
      );
      return ctx.send({ data });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  GetMyConnectionRequsetsReceived: async (ctx) => {
    try {
      const { user } = ctx.state;
      let { page } = ctx.request.query;
      page = page * 1 < 1 ? 1 : page;
      const data = await strapi.entityService.findPage(
        "api::connection-request.connection-request",
        {
          page,
          pageSize: 15,
          filters: {
            to: user.id,
          },
          populate: {
            from: {
              fields: ["fullName", "title", "username"],
              populate: { profilePic: { fields: ["url"] } },
            },
          },
        }
      );
      return ctx.send({ data });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
  requestForConnection: async (ctx) => {
    try {
      const { error } = await Createvalidation(
        requestForConnectionVal,
        ctx.request.body
      );
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { to } = ctx.request.body;
      const { user } = ctx.state;

      const isBlocked = await strapi.db
        .query("api::block-list.block-list")
        .findOne({
          where: {
            $or: [
              { from: user.id, to },
              { from: to, to: user.id },
            ],
          },
        });
      if (isBlocked) return ctx.badRequest("user not found");

      const isMakeBefore = await strapi.db
        .query("api::connection-request.connection-request")
        .findOne({
          where: { from: user.id, to },
        });
      if (isMakeBefore)
        return ctx.badRequest("You have already sent a request for connection");
      const isAlreadyConnected = await strapi
        .query("api::connection.connection")
        .findOne({
          where: {
            user_1: user.id,
            user_2: to,
          },
        });
      if (isAlreadyConnected)
        return ctx.badRequest("You are already connected with this user");
      const data = await strapi.entityService.create(
        "api::connection-request.connection-request",
        {
          data: { from: user.id, to },
        }
      );
      return ctx.send({
        data: {
          message: "request for connection sent successfully",
        },
      });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
  acceptConnection: async (ctx) => {
    try {
      const { error } = await Createvalidation(
        acceptConnectionVal,
        ctx.request.params
      );
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { id } = ctx.request.params;
      const { user } = ctx.state;
      const isExist = await strapi.db
        .query("api::connection-request.connection-request")
        .findOne({
          where: { id, to: user.id },
          populate: {
            from: {
              fields: ["id"],
            },
          },
        });
      console.log(isExist);
      if (!isExist)
        return ctx.badRequest(
          "this connection is not found or Unauthorized for you"
        );
      await strapi.entityService.delete(
        "api::connection-request.connection-request",
        id
      );

      const addToConnectionList = await strapi.entityService.create(
        "api::connection.connection",
        {
          data: {
            user_1: isExist?.from?.id,
            user_2: user.id,
            users: [isExist?.from?.id, user.id],
          },
        }
      );
      return ctx.send({
        data: {
          message: "Connection request accepted",
        },
      });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
  deleteConnectionRequset: async (ctx) => {
    try {
      const { error } = await Createvalidation(
        deleteConnectionRequsetVal,
        ctx.request.params
      );
      if (error) {
        return ctx.badRequest(error.details[0].message);
      }
      const { id } = ctx.request.params;
      const { user } = ctx.state;

      const isExist = await strapi.db
        .query("api::connection-request.connection-request")
        .findOne({
          where: { id, $or: [{ to: user.id }, { from: user.id }] },
          populate: {
            from: {
              fields: ["id"],
            },
          },
        });
      if (!isExist)
        return ctx.badRequest(
          "this connection is not found or Unauthorized for you"
        );
      await strapi.entityService.delete(
        "api::connection-request.connection-request",
        id
      );
      return ctx.send({
        data: {
          message: "Connection request rejected",
        },
      });
    } catch (e) {
      console.log(e);
      return ctx.badRequest(e);
    }
  },
};
