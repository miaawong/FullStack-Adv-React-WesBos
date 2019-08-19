// if the query exactly the same on yoga as prisma, you can forward query from yoga to prisma
const { forwardTo } = require("prisma-binding");

const Query = {
    items: forwardTo("db"),
    item: forwardTo("db")
    // async items(parent, args, ctx, info) {
    //     // getting all items
    //     const items = await ctx.db.query.items();
    //     return items;
    // }
};

module.exports = Query;
