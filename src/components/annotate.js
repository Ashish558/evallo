import React, { useEffect, useState } from 'react';
import { TextAnnotator } from 'react-text-annotate';
import Tippy from '@tippyjs/react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // Import the CSS
import './annotate.css'
export default function AnnotatorComponent() {
  const [annotations, setAnnotations] = useState([]);

  const handleAnnotationChange = (newAnnotations) => {
    setAnnotations(newAnnotations);
  };

  useEffect(() => {
    tippy('mark', {
      content: 'This is the hover text',
    });
  }, [annotations]);

  return (
    <div className='w-[1920px] flex flex-col items-center'>
      <TextAnnotator
        content="Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation...Sample question for annotation..."
        value={annotations}
        onChange={handleAnnotationChange}
        getSpan={(span) => ({
          ...span,
        })}
        span={({ children, ...spanProps }) => (
          <Tippy content="This is the hover text">
            <mark className='highlighted'
              {...spanProps}
              style={{ backgroundColor: 'red !important', textDecoration: 'underline' }}            >
              {children}
            </mark>
          </Tippy>
        )}
      />
    </div>
  );
}
