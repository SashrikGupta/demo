import { Helmet } from 'react-helmet-async';

import View from 'src/sections/chat/Chat';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Blog | Minimal UI </title>
      </Helmet>

      <View/>
    </>
  );
}