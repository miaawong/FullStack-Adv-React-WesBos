import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            id
            email
            name
        }
    }
`;
export default class SignIn extends Component {
    state = {
        name: "",
        email: "",
        password: ""
    };
    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
    };
    render() {
        return (
            <Mutation
                mutation={SIGNIN_MUTATION}
                variables={this.state}
                // when SIGNIN mutation is complete, it will refetch the current user query
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signIn, { error, loading }) => {
                    return (
                        <Form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                const res = await signIn();
                                this.setState({
                                    name: "",
                                    email: "",
                                    password: ""
                                });
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign In </h2>
                                <Error error={error} />
                                <label htmlFor="email">
                                    {" "}
                                    Email{" "}
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email"
                                        value={this.state.email}
                                        onChange={this.saveToState}
                                    />
                                </label>

                                <label htmlFor="password">
                                    Password
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="password"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Sign In</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}
