import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

// need a single item based on the id
const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;
const UPDATE_ITEM_MUTATION = gql`
    # set up query to take arguments
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            # return
            id
            title
            description
            price
        }
    }
`;

class UpdateItem extends Component {
    // only putting things into state, which have change, so it can be empty
    state = {};
    handleChange = e => {
        //give us access to in the input's name,type,value
        const { name, type, value } = e.target;
        const val = type === "number" ? parseFloat(value) : value;
        this.setState({ [name]: val });
    };
    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log("updating item");
        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
        console.log("updated ");
    };

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ data, loading }) => {
                    if (loading) return <p>loading...</p>;
                    if (!data.item)
                        return <p>no item found for id: {this.props.id}</p>;
                    return (
                        <Mutation
                            mutation={UPDATE_ITEM_MUTATION}
                            variables={this.state}
                        >
                            {(updateItem, { loading, error }) => (
                                // pass methods to an component
                                <Form
                                    onSubmit={e =>
                                        this.updateItem(e, updateItem)
                                    }
                                >
                                    <Error error={error} />
                                    <fieldset
                                        disabled={loading}
                                        aria-busy={loading}
                                    >
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                placeholder="title"
                                                required
                                                // one time value, in react, default value, allows us to set a input box to some text, without tying it to state
                                                defaultValue={data.item.title}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                placeholder="price"
                                                required
                                                defaultValue={data.item.price}
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <input
                                                type="text"
                                                id="description"
                                                name="description"
                                                placeholder="description"
                                                required
                                                defaultValue={
                                                    data.item.description
                                                }
                                                onChange={this.handleChange}
                                            />
                                        </label>
                                        <button type="submit">
                                            Sav{loading ? "ing" : "e"}
                                        </button>
                                    </fieldset>
                                </Form>
                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}
export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
