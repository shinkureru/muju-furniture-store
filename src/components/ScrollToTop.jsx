import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;

/*
如果瀏覽器或 ESLint 對 behavior: 'instant' 有意見，就改成最穩的版本：window.scrollTo(0, 0);

useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); 
  
*/
