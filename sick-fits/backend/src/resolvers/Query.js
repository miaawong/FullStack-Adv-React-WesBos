// if the query exactly the same on yoga as prisma, you can forward query from yoga to prisma
const { forwardTo } = require("prisma-binding");

const Query = {
    items: forwardTo("db"),
    item: forwardTo("db"),
    itemsConnection: forwardTo("db")
};

module.exports = Query;
