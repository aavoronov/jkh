import Link from "next/link";
import Head from "next/head";
import React, { useState } from "react";

export default function Layout({ children }) {
  return (
    <div className='container'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      {children}
      <style jsx>{`
        .container {
          width: 100%;
          max-width: 1920px;
          margin: 0 auto;
        }
        .hidden {
          display: none;
        }
      `}</style>
      <style jsx global>{`
        html {
          overflow-x: hidden;
        }
        html,
        body {
          overflow-x: hidden;
          padding: 0;
          margin: 0;
          // background-color: red;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
          font-family: "Roboto";
          font-style: normal;
          font-size: 16px;
        }
        li {
          list-style: none;
        }

        a {
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
