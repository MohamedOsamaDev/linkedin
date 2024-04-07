module.exports = {
  GetMyBlockList: async (ctx) => {
    try {
      const { user } = ctx.state;
      let { page } = ctx.request.query;
      page = page * 1 < 1 ? 1 : page;
      const blockList = await strapi.entityService.findPage(
        "api::block-list.block-list",
        {
          page,
          pageSize: 15,
          filters: { from: user.id },
        }
      );

      return ctx.send({ data: blockList });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  addBlock: async (ctx) => {
    try {
      const { user } = ctx.state;
      const { to } = ctx.request.body;
      if (+to === +user.id) return ctx.badRequest("You cannot block yourself");
      const isBlockedBefore = await strapi.db
        .query("api::block-list.block-list")
        .findOne({
          where: { from: user.id, to },
        });

      if (isBlockedBefore) {
        return ctx.badRequest("Already Blocked");
      }
      const newBlock = await strapi.entityService.create(
        "api::block-list.block-list",
        {
          data: {
            from: user.id,
            to,
          },
        }
      );
      // handle delete old connection
      const oldConnection = await strapi.db
        .query("api::connection.connection")
        .findOne({
          where: {
            $or: [
              {
                user_1: user.id,
                user_2: to,
              },
              {
                user_1: to,
                user_2: user.id,
              },
            ],
          },
        });
      if (oldConnection) {
        await strapi.entityService.delete(
          "api::connection.connection",
          oldConnection.id
        );
      }
      const oldConnectionRequest = await strapi.db
        .query("api::connection.connection")
        .findOne({
          where: {
            $or: [
              {
                from: user.id,
                to,
              },
              {
                from: to,
                to: user.id,
              },
            ],
          },
        });
      if (oldConnectionRequest) {
        await strapi.entityService.delete(
          "api::connection-request.connection-request",
          oldConnectionRequest.id
        );
      }

      return ctx.send({
        data: {
          message: "Successfully Blocked",
        },
      });
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
  removeBlock: async (ctx) => {
    try {
      const { user } = ctx.state;
      const { id } = ctx.request.param;
      const findIsBlocked = await strapi.entityService.findOne(
        "api::block-list.block-list",
        id,
        {
          populate: {
            from: {
              fields: ["id"],
            },
            to: {
              fields: ["id"],
            },
          },
        }
      );
      if (!findIsBlocked) {
        return ctx.badRequest({ message: "Not Blocked" });
      }
      if (
        findIsBlocked.from.id !== user.id &&
        findIsBlocked.to.id !== user.id
      ) {
        return ctx.badRequest({ message: "Not Blocked" });
      }
      await strapi.entityService.delete("api::block-list.block-list", id);
    } catch (error) {
      return ctx.badRequest(error);
    }
  },
};
