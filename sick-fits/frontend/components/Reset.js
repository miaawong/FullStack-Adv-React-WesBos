import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql, { resetCaches } from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import PropTypes from "prop-types";
import { CURRENT_USER_QUERY } from "./User";

const RESET_PASSWORD_MUTATION = gql`
    mutation RESET_PASSWORD_MUTATION(
        $resetToken: String!
        $password: String!
        $confirmPassword: String!
    ) {
        resetPassword(
            resetToken: $resetToken
            password: $password
            confirmPassword: $confirmPassword
        ) {
            id
            name
            email
        }
    }
`;
export default class RequestReset extends Component {
    static propTypes = {
        resetToken: PropTypes.string.isRequired
    };
    state = {
        password: "",
        confirmPassword: ""
    };
    saveToState = e => {
        this.setState({ [e.target.name]: e.target.value });
    };
    render() {
        return (
            <Mutation
                mutation={RESET_PASSWORD_MUTATION}
                variables={{
                    resetToken: this.props.resetToken,
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(resetPassword, { error, loading }) => {
                    return (
                        <Form
                            method="post"
                            onSubmit={async e => {
                                e.preventDefault();
                                await resetPassword();
                                this.setState({
                                    password: "",
                                    confirmPassword: ""
                                });
                            }}
                        >
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Reset Your password</h2>
                                <Error error={error} />

                                <label htmlFor="password">
                                    Password
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Password"
                                        value={this.state.confirmPassword}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Reset</button>
                            </fieldset>
                        </Form>
                    );
                }}
            </Mutation>
        );
    }
}
