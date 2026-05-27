// pages/_document.tsx
//
// Custom Next.js Document — Pages Router.
//
// The sole purpose of this file is to inject Mantine's
// ColorSchemeScript into <head> BEFORE any other scripts.
// This prevents the flash-of-incorrect-color-scheme (FOICS)
// on first load by setting data-mantine-color-scheme on <html>
// synchronously before React hydrates.
//
// Do not add global providers here — they belong in _app.tsx.
// Do not import client-side code here — _document runs on the server.

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from "next/document";
import { ColorSchemeScript } from "@mantine/core";

export default class CrewPulseDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/*
            ColorSchemeScript must be the FIRST thing in <head>.
            It emits a tiny inline <script> that reads
            localStorage("mantine-color-scheme") and sets
            data-mantine-color-scheme on <html> before paint.
            Without this, dark-mode users see a white flash.

            defaultColorScheme="auto" honours the OS preference
            on first visit (before the user sets a preference).
          */}
          <ColorSchemeScript defaultColorScheme="auto" />

          {/* Favicon — replace with your actual assets */}
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#185FA5" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
