import React from 'react'

export default function YoutubeEmbed({ embedId }) {

   return (
      <div className="video-responsive" style={{
         position: 'absolute',
         left: '0',
         top: '0',
         width: '100%',
         height: '600px',
         zIndex: '-1'
      }} >
         <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${embedId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
         />
      </div>
   )
}
