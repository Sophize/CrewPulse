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
          {/* Prevents dark/light mode flash before hydration */}
          <ColorSchemeScript defaultColorScheme="auto" />

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
