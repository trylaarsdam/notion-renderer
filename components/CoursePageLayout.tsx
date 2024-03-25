import { NavbarSimple } from "./CourseSidebar";
import classes from './CoursePageLayout.module.css';
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({
	params,
	res,
  }) => {
	const pageId = params?.pageId as string;
	const courseId = params?.courseId as string;
  
	return {
	  props: {
		pageId,
		courseId,
	  },
	};
  };

const CoursePageLayout = ({ children, pageId, courseId }) => {
  return (
    <div className="container">
    <nav style={{height: "100vh", position: "sticky", top: 0}}>
      <NavbarSimple title={pageId} />
    </nav>
    <div className="main">
      {children}
    </div>
  </div>
  );
};

export default CoursePageLayout;
