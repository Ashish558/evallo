import React, { useEffect, useState } from 'react'

export default function YoutubeEmbed({ embedId }) {

   const [youtubeId, setYoutubeId] = useState('')
   function youtube_parser(url) {
      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
         return match[2];
      } else {
         return false
      }
   }
   useEffect(() => {
      if (embedId === undefined) {
         setYoutubeId(false)
      } else {
         let id = youtube_parser(embedId)
         setYoutubeId(id)
      }
   }, [])

   return (
      <div className="video-responsive" style={{
         position: 'absolute',
         left: '0',
         top: '0',
         width: '100%',
         height: '600px',
         zIndex: '-1'
      }} >
         {
            embedId !== undefined && youtubeId !== false ?
               <>
                  <iframe
                     width="100%"
                     height="100%"
                     src={`https://www.youtube.com/embed/${youtubeId}`}
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     title="Embedded youtube"
                  />
               </> : <></>
         }
      </div>
   )
}
