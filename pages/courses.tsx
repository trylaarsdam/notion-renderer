import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Grid,
  Group,
  Loader,
  SimpleGrid,
  Skeleton,
  rem,
} from "@mantine/core";
import { CourseCard } from "../components/CourseCard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
        console.log("uid", uid);
      } else {
        // User is signed out
        // ...
        router.push("/login");
        console.log("user is logged out");
      }

      var result = await fetch("https://api.lms.toddr.org/enrollments/my", {
        headers: {
          Authorization: `${await auth.currentUser?.getIdToken()}`,
        },
      });

      if (result.status !== 200) {
        console.log("error retreiving courses");
        return;
      } else {
        var data = await result.json();
        console.log(data);
        setCourses(data);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div>
        <Group mt={50} justify="center">
          <h1>Enrolled Courses</h1>
        </Group>
        <Group mt={50} justify="center">
			<Loader />
		</Group>
      </div>
    );
  } else {
    return (
      <div>
        <Group mt={50} justify="center">
          <h1>Enrolled Courses</h1>
        </Group>
        <Container my="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                description={course.description}
                image={course.image}
                points={course.points}
                // pass other properties as props
              />
            ))}
          </SimpleGrid>
        </Container>
      </div>
    );
  }
}
