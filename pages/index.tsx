import { Button, Group, Text } from "@mantine/core";
import Link from "next/link";

export default function IndexPage() {
  return (
	<div>
		<Group mt={50} justify="center">
			<h1>Notion... but it&apos;s in a custom webapp</h1>
    	</Group>
		{/* <Group mt={10} justify="center">
			<Link href="/page/067dd719a912471ea9a3ac10710e7fdf">
				<Button size="md">View sample notion page</Button>
			</Link>
    	</Group> */}
		<Group mt={10} justify="center">
			<Link href="/login">
				<Button size="md" mr={30}>Login</Button>
				<Button size="md">Signup</Button>
			</Link>
    	</Group>
	</div>
  );
}
