import { supabase } from '@/lib/client'
import '@/styles/globals.css'
import { Provider } from 'react-supabase'

export default function App({ Component, pageProps }) {
  return (
    <Provider value={supabase}>
      <Component {...pageProps} />
    </Provider>
  )

}
