import { Helmet } from 'react-helmet-async';
import PSRC from 'src/sections/pdfchat/PdfSrc';
import View  from 'src/sections/pdfchat/view';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Minimal UI </title>
      </Helmet>

      <PSRC> 
      <View />
      </PSRC>
    </>
  );
}
