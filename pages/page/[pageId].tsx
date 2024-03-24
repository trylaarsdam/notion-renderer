'use client'

import * as React from "react";
import { NotionRenderer } from "react-notion-x";
import Image from "next/image";
import Link from "next/link";

import dynamic from "next/dynamic";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => {
    // additional prism syntaxes
    await Promise.all([
      import("prismjs/components/prism-markup-templating"),
      import("prismjs/components/prism-markup"),
      import("prismjs/components/prism-bash.js"),
      import("prismjs/components/prism-c.js"),
      import("prismjs/components/prism-cpp"),
      import("prismjs/components/prism-csharp.js"),
      import("prismjs/components/prism-docker.js"),
      import("prismjs/components/prism-java.js"),
      import("prismjs/components/prism-js-templates.js"),
      import("prismjs/components/prism-coffeescript.js"),
      import("prismjs/components/prism-diff.js"),
      import("prismjs/components/prism-git.js"),
      import("prismjs/components/prism-go.js"),
      import("prismjs/components/prism-graphql.js"),
      import("prismjs/components/prism-handlebars.js"),
      import("prismjs/components/prism-less.js"),
      import("prismjs/components/prism-makefile.js"),
      import("prismjs/components/prism-markdown.js"),
      import("prismjs/components/prism-objectivec.js"),
      import("prismjs/components/prism-ocaml.js"),
      import("prismjs/components/prism-python.js"),
      import("prismjs/components/prism-reason.js"),
      import("prismjs/components/prism-rust.js"),
      import("prismjs/components/prism-sass.js"),
      import("prismjs/components/prism-scss.js"),
      import("prismjs/components/prism-solidity.js"),
	  import("prismjs/components/prism-verilog.js"),
      import("prismjs/components/prism-sql.js"),
      import("prismjs/components/prism-stylus.js"),
      import("prismjs/components/prism-swift.js"),
      import("prismjs/components/prism-wasm.js"),
      import("prismjs/components/prism-yaml.js"),
    ]);
    return m.Code;
  })
);

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

import { GetServerSideProps } from "next";

// getServerSideProps
export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}) => {
  const pageId = params?.pageId as string;
  const response = await fetch(`http://localhost:3001/page/${pageId}`);

  if (response.status !== 200) {
    res.writeHead(302, { Location: "/404" });
    res.end();
    return { props: {} };
  }

  const recordMap = await response.json();

  return {
    props: {
      recordMap,
    },
  };
};

export default function Page({ recordMap }) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={false}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        Pdf,
        nextImage: Image,
        nextLink: Link,
      }}
	  mapPageUrl= { (pageId) => `/page/${pageId}` }
	  mapImageUrl={(url, block) => `http://localhost:3001/image/${block.id}?workspace=${url.split("/")[3]}`}
    />
  );
}