// if the query exactly the same on yoga as prisma, you can forward query from yoga to prisma
const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
    items: forwardTo("db"),
    item: forwardTo("db"),
    itemsConnection: forwardTo("db"),
    me(parent, args, ctx, info) {
        //check if there is a current userid
        if (!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
    },
    users(parent, args, ctx, info) {
        // logged in or not
        if (!ctx.request.userId) {
            throw new Error("Please Sign In first...");
        }
        // check if the user has permissions to query all users
        hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
        // if they do, query all the users
        return ctx.db.users({}, info);
    }
};

module.exports = Query;
