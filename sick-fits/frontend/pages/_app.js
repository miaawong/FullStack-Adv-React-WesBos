import App, { Container } from "next/app";
import Page from "../components/Page";
class MyApp extends App {
    render() {
        const { Component } = this.props;

        return (
            <Container>
                <Page>
                    {/* component will be whatever the 'page' is... sell or index(for ex) */}
                    <Component />
                </Page>
            </Container>
        );
    }
}

export default MyApp;
