import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useParams } from "next/navigation";
import { Group, Loader } from "@mantine/core";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const courseId = params?.courseId as string;

  return {
    props: {
      courseId,
    },
  };
};

export default function CoursePage({ courseId }) {
  const router = useRouter();

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

      const response = await fetch(`http://localhost:3001/course/${courseId}`, {
        headers: {
          Authorization: `${await auth.currentUser?.getIdToken()}`,
        },
      });

      if (response.status !== 200) {
        router.push("/404")
      }

      var result = await response.json();
      router.replace(`/course/${courseId}/page/${result.home}`)
    });

    // load course data
  }, []);

  return (
    <Group mt={50} justify="center">
      <Loader color="blue" />
    </Group>
  );
}
