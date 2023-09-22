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
   }, [embedId])

   return (
      <div className="video-responsive " style={{
         position: 'absolute',
         left: '0',
         top: '0',
         width: '100%',
         height: '600px',
         zIndex: '-1',

         paddingBottom: '157px'
      }} >
         {
            embedId !== undefined && youtubeId !== false ?
               <>
                  <iframe
                     width="100%"
                     height="100%"
                     src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&showinfo=0&controls=0`}
                     frameBorder="0"
                     allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                     title="Embedded youtube"
                     style={{ borderRadius: '10px' }}
                  />
               </> : <></>
         }
      </div>
   )
}
