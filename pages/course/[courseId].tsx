"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useParams } from "next/navigation";
import { Group, Loader } from "@mantine/core";

export default function CoursePage({ recordMap }) {
  const router = useRouter();
  const params = useParams<{ courseId: string }>()

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

	

    // load course data
  }, []);

  return (
    <Group mt={50} justify="center">
      <Loader color="blue" />
    </Group>
  );
}
