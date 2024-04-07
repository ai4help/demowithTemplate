import '../styles/globals.scss';
import Landingpagelayout from '../../shared/layout-components/layout/landingpage-layout'
import AuthenticationLayout from '../../shared/layout-components/layout/authentication-layout'
import ContentLayout from '../../shared/layout-components/layout/content-layout'
import { useRouter } from 'next/router';
import PageLayout from '../../shared/layout-components/layout/page-layout';

const layouts = {
  Contentlayout: ContentLayout,
  Landingpagelayout: Landingpagelayout,
  PageLayout: PageLayout,
  AuthenticationLayout: AuthenticationLayout,
};
function MyApp({ Component, pageProps }) {
  const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);
  return (
    <>

    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  )
}

export default MyApp;
