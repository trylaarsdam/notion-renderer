import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme";
import { DoubleNavbar } from "../components/DoubleNavbar";
import '../styles/global.css';

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'

export default function App({ Component, pageProps }: any) {
	const getLayout = Component.getLayout || ((page) => page);
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Turing Guild</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="https://toddr.org/assets/images/t-logo.png" />
      </Head>
	  <div className="container">
	  <nav className="navbar">
		<DoubleNavbar />
	  </nav>
	  <div className="main">
		{getLayout(<Component {...pageProps} />)}
	  </div>
	  </div>
	</MantineProvider>
  );
}
