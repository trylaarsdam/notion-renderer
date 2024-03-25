import { NavbarSimple } from "./CourseSidebar";
import classes from "./CoursePageLayout.module.css";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

const CoursePageLayout = ({ children }) => {
  return (
    <div className="container">
      <nav style={{ height: "100vh", position: "sticky", top: 0 }}>
        <NavbarSimple />
      </nav>
      <div className="main">{children}</div>
    </div>
  );
};

export default CoursePageLayout;
