import { Helmet } from 'react-helmet-async';
// sections
// import BlankView from 'src/sections/blank/view';
import ComingSoonView from 'src/sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function BlankPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Blank</title>
      </Helmet>

      {/** 
      <BlankView /> */}
      <ComingSoonView />
    </>
  );
}
