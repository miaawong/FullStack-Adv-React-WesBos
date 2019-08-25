const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    },
    async signUp(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        // hash password
        const password = await bcrypt.hash(args.password, 10);
        //create the user in the db
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: { set: ["USER"] }
                }
            },
            info
        );
        // create json web token (JWT)
        // 2nd arg is app secret
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // set the jwt as a cookie on the response, so that every time they go to another page the token will be sent along with them
        ctx.response.cookie("token", token, {
            //    cannot access the token by JS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        });
        //return user to browser
        return user;
    },
    async signIn(parent, { email, password }, ctx, info) {
        //check if there is a user with that email
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }
        // check is password is true
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            // throwing an error so that it will be shown on the frontend
            throw new Error("Invalid password");
        }
        // generate jwt token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // set cookie with the token
        ctx.response.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });
        // return the user
        return user;
    }
};

module.exports = mutations;
