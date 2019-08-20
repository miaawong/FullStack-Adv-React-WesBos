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
    },
    updateItem(parent, args, ctx, info) {
        // first take a copy of the updates
        const updates = { ...args };
        //remove the id from the updates, since we don't want to update the id
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id
                }
            },
            //include info so that updateItems knows what to return
            info
        );
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        //1.find the item
        // becuz it takes in a 2nd query, we have to manually pass in our query instead of 'info'
        const item = await ctx.db.query.item({ where }, `{id, title}`);
        //2. check if they own that item, or have permissions
        //todo
        //3. delete it
        return ctx.db.mutation.deleteItem({ where }, info);
    }
};

module.exports = mutations;
