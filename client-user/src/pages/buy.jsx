import { Helmet } from 'react-helmet-async';

import Buy from '../sections/buy/buy'

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Buy />
    </>
  );
}