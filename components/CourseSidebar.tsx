import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import {
  IconHexagons,
  IconHome,
  IconGauge,
  IconChartBar
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './CourseSidebar.module.css';

const data = [
  { link: '', label: 'Home', icon: IconHome },
  { link: '', label: 'Modules', icon: IconHexagons },
  { link: '', label: 'Grades', icon: IconGauge },
  { link: '', label: 'Quiz Rankings', icon: IconChartBar },
];



export function NavbarSimple({ title }) {
  const [active, setActive] = useState('Home');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <h1>Course Name Here {title}</h1>
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