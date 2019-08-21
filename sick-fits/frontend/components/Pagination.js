import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Head from "next/head";
import Link from "next/link";
import { perPage } from "../config";

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;
const Pagination = props => (
    <Query query={PAGINATION_QUERY}>
        {({ data, loading, error }) => {
            if (loading) return <p>loading...</p>;
            if (error) return <p>error... {error}</p>;
            const count = data.itemsConnection.aggregate.count;
            const pages = Math.ceil(count / perPage);
            const page = props.page;
            return (
                <PaginationStyles>
                    <Head>
                        <title>
                            Sick Fit! Page {page} of {pages}{" "}
                        </title>
                    </Head>
                    <Link
                        // in production prefetch will pre render both the previous and forward page, so you're always loading the next one before you even click
                        prefetch
                        href={{
                            pathname: "/items",
                            query: { page: page - 1 }
                        }}
                    >
                        <a className="prev" aria-disabled={page <= 1}>
                            Prev
                        </a>
                    </Link>
                    <p>
                        Page {page} of {pages}
                    </p>
                    <p>{count} total</p>
                    <Link
                        prefetch
                        href={{
                            pathname: "/items",
                            query: { page: page + 1 }
                        }}
                    >
                        <a className="prev" aria-disabled={page >= pages}>
                            Next
                        </a>
                    </Link>
                </PaginationStyles>
            );
        }}
    </Query>
);
export default Pagination;
