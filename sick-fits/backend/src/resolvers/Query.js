// if the query exactly the same on yoga as prisma, you can forward query from yoga to prisma
const { forwardTo } = require("prisma-binding");

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
    }
};

module.exports = Query;
