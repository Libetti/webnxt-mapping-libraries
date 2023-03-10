import { AppProps } from 'next/app'
import Link from 'next/link'
import '../styles/global.scss'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return <>      
      <Component {...pageProps} />
  </>
}
