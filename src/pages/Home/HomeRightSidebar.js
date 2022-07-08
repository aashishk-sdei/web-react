import React, { useEffect } from "react";
import StoryStartersCard from "./StoryStartersCard";
import MiloAssistant from "./MiloAssistant";
import Footer from "../../components/Footer";

const HomeRightSidebar = ({ user }) => {
  useEffect(() => {
    let footerLink = document.querySelector(".footer-right");
    if (user?.mobileNumber) {
      footerLink?.classList?.add("footer-fixed");
    } else {
      footerLink?.classList?.remove("footer-fixed");
    }
  }, [user]);
  return (
    <>
      {!user?.mobileNumber && <MiloAssistant />}
      <StoryStartersCard />
      {user && <Footer />}
    </>
  );
};
export default HomeRightSidebar;
