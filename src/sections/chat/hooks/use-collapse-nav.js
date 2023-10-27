import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export default function useCollapseNav() {
  const [openMobile, setOpenMobile] = useState(true);

  const [collapseDesktop, setCollapseDesktop] = useState(true);

  const onCollapseDesktop = useCallback(() => {
    setCollapseDesktop((prev) => !prev);
  }, []);

  const onCloseDesktop = useCallback(() => {
    // setCollapseDesktop(false);
    setCollapseDesktop(true);
  }, []);

  const onOpenMobile = useCallback(() => {
    setOpenMobile(true);
  }, []);

  const onCloseMobile = useCallback(() => {
    setOpenMobile(false);
  }, []);

  return {
    openMobile,
    collapseDesktop,
    //
    onOpenMobile,
    onCloseMobile,
    onCloseDesktop,
    onCollapseDesktop,
  };
}
