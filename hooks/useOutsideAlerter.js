import { openAuthSidebar } from "@/store/siteSlice";
import { useDispatch } from "react-redux";

const { useEffect } = require("react");

function useOutsideAlerter(ref) {
    const dispatch = useDispatch();
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
        let className = event.target.className
        className = className.baseVal ?? className
      if (ref.current && !ref.current.contains(event.target) && className.indexOf("navDetect") === -1) {
        // console.log(event.target.className)
        // alert("You clicked outside of me!");
        dispatch(openAuthSidebar(false))
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const trigger = () => {

  }

  return {
    trigger
  }
}

export default useOutsideAlerter;
