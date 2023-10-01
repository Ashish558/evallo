import React, { useState } from "react";
import { TextAnnotator } from "react-text-annotate";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Import the CSS

export default function AnnotatorComponent() {
  const [annotations, setAnnotations] = useState([]);

  const handleAnnotationChange = (newAnnotations) => {
    setAnnotations(newAnnotations);
  };

  const getSpan = (span) => {
    const spanProps = {
      key: span.key,
      style: {
        backgroundColor: "red",
      },
    };

    const children = span.content;

    return (
      <Tippy content="This is the hover text">
        <mark {...spanProps}>{children}</mark>
      </Tippy>
    );
  };

  return (
    <div>
      <TextAnnotator
        content="Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation..."
        value={annotations}
        onChange={handleAnnotationChange}
        getSpan={getSpan}
        span={({ children, ...spanProps }) => (
          <span {...spanProps}>{children}</span>
        )}
      />
    </div>
  );
}
