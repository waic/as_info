import React from 'react';
import App from 'next/app';

import NextSeo from 'next-seo';
import SEO from '../next-seo.config';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <NextSeo config={SEO} />
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
