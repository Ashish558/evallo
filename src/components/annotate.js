import React, { useState, useEffect } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import { Tooltip as ReactTooltip }  from 'react-tooltip';
export default function AnnotatorComponent() {
  const [allAnnotations, setAllAnnotations] = useState(Array(10).fill([]));
  const questions = Array(10).fill('Sample question for annotation...');

  const handleAnnotationChange = (index, newAnnotations) => {
    const updatedAnnotations = [...allAnnotations];
    updatedAnnotations[index] = newAnnotations;
    setAllAnnotations(updatedAnnotations);
  };

  const tooltips = allAnnotations.map((annotations, index) => (
    <ReactTooltip
      key={index}
      id={`tooltip-${index}`}
      place="top"
      effect="solid"
    >
      This is the hover text
    </ReactTooltip>
  ));

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index}>
          <TextAnnotator
            content={question}
            value={allAnnotations[index]}
            onChange={(newAnnotations) => {
              if (true) {
                handleAnnotationChange(index, newAnnotations);
              }
            }}
            getSpan={(span) => ({
              ...span,
              color: 'yellow',
              dataTip: 'This is the hover text',
              dataFor: `tooltip-${index}`
            })}
          />
        </div>
      ))}

      {tooltips}
    </div>
  );
}
