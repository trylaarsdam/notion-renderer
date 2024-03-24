import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "../components/Authentication.module.css";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push("/courses");
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Login
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
		<Link href="/signup">
			<Anchor size="sm" component="button">
			Create account
			</Anchor>
		</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="email@example.com" required onSubmit={onLogin} onChange={handleEmailChange}/>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
		  onChange={handlePasswordChange}
		  onSubmit={onLogin}
          mt="md"
        />

        <Button fullWidth mt="xl" onClick={onLogin}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
