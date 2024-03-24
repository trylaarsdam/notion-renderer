import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Grid,
  Group,
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

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
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
    });
  }, []);

  useEffect(() => {
    // This is where you would typically load data from an API
    const loadedCourses = [
      {
        id: 1,
        title: "Course 1",
        description: "This is course 1",
        score: "94%",
        image: "https://fakeimg.pl/600x200?text=Course+Cover+Image",
        // ...other properties
      },
      // ...other courses
    ];

    setCourses(loadedCourses);
  }, []);

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
              title={course.title}
              description={course.description}
              image={course.image}
              score={course.score}
              // pass other properties as props
            />
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
}
