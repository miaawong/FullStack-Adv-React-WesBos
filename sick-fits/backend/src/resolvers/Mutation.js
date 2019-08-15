const mutations = {
    async createItem(parent, args, ctx, info) {
        //checked if they are logged in
        //ctx.db = our database
        // belows turns a promise, await the creation of item
        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    ...args
                }
            },
            // info needs to be passed as a 2nd argument because it is the query
            // ctx.db.mutations needs to take the query from frontend and pass it to
            // our backend and info will specify what data gets return from the db when we create it
            info
        );
        return item;
    }
};

module.exports = mutations;
