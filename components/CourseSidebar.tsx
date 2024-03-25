import { useState } from "react";
import { Group, Code, Loader } from "@mantine/core";
import {
  IconHexagons,
  IconHome,
  IconGauge,
  IconChartBar,
} from "@tabler/icons-react";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./CourseSidebar.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export function NavbarSimple({}) {
  const [active, setActive] = useState("Home");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([
    { link: "", label: "Home", icon: IconHome },
    { link: "", label: "Modules", icon: IconHexagons },
    { link: "", label: "Grades", icon: IconGauge },
    { link: "", label: "Quiz Rankings", icon: IconChartBar },
  ]);
  const router = useRouter();
  const courseId = router.query.courseId as string;
  var [course, setCourse] = useState<any>({});
  var [currentHref, setCurrentHref] = useState("");

  const links = data.map((item) => (
    <Link
      key={item.label}
      href={item.link}
      className={classes.link}
      passHref={true}
      legacyBehavior
    >
      <a
        className={classes.link}
        data-active={undefined}
        href={item.link}
        key={item.label}
        onClick={(event) => {
          console.log(router.route);
          event.preventDefault();
		  if (!item.link.endsWith("undefined")) {
			window.location.href = item.link;
		  }
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
    </Link>
  ));

  useEffect(() => {
    setCurrentHref(window.location.href);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
        var response = await fetch(`https://api.lms.toddr.org/course/${courseId}`, {
          headers: {
            Authorization: `${await auth.currentUser?.getIdToken()}`,
          },
        });
        console.log("Queried course", courseId);
        var json = await response.json();
        console.log(json);
        setCourse(json);
        var dataCopy = data;
        dataCopy[0].link = `/course/${json.id}/page/${json.home}`;
        dataCopy[1].link = `/course/${json.id}/page/${json.modules}`;
        dataCopy[2].link = `/course/${json.id}/page/${json.grades}`;
        dataCopy[3].link = `/course/${json.id}/page/${json.quizRankings}`;
        setData(dataCopy);
        setIsLoading(false);
      } else {
      }
    });

    // Clean up function
    return () => unsubscribe();
  }, []); // <-- empty array means this effect runs once on mount

  if (isLoading) {
    return <Group mt={50} align="center" justify="center" ><Loader /></Group>;
  } else {
    return (
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            <h1>{course?.name}</h1>
            {/* <Code fw={700}></Code> */}
          </Group>
          {links}
        </div>

        {/* <div className={classes.footer}>
			<a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
			  <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
			  <span>Change account</span>
			</a>
	
			<a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
			  <IconLogout className={classes.linkIcon} stroke={1.5} />
			  <span>Logout</span>
			</a>
		  </div> */}
      </nav>
    );
  }
}
