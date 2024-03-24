import { Card, Image, Text, Group, Button } from '@mantine/core';
import classes from './CourseCard.module.css';
import Link from 'next/link';

const stats = [
  { title: 'Points' },
];

interface CourseCardProps {
	id: string;
	title: string;
	description: string;
	image: string;
	score: string;
}

export function CourseCard({id, name, description, image, points}) {
  var items = stats.map((stat) => (
    <div key={stat.title}>
      <Text size="xs" color="dimmed">
        {stat.title}
      </Text>
      <Text fw={500} size="sm">
        {points}
      </Text>
    </div>
  ));

  items.push((
	<div>
		<Link href={"/course/" + id}>
			<Button>Enter Course</Button>
		</Link>
	</div>
  ))

  return (
    <Card withBorder padding="lg" className={classes.card}>
      <Card.Section>
        <Image
          src={image}
          alt="Course Image"
          height={100}
        />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <Text fz="lg" fw={700} className={classes.title}>
          {name}
        </Text>
        {/* <Group gap={5}>
          <Text fz="xs" c="dimmed">
            {}% completed
          </Text>
          <RingProgress size={18} thickness={2} sections={[{ value: 80, color: 'blue' }]} />
        </Group> */}
      </Group>
      <Text mt="sm" mb="md" c="dimmed" fz="xs">
        {description}
      </Text>
      <Card.Section className={classes.footer}>{items}</Card.Section>
    </Card>
  );
}