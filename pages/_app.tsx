import '@/styles/globals.css'
import { ComponentType, Fragment } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  layout?: ComponentType
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const Layout = Component.layout ?? Fragment

  return (<>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    <ToastContainer/>
  </>)
}

//referensi: https://stackoverflow.com/questions/62115518/persistent-layout-in-next-js-with-typescript-and-hoc
