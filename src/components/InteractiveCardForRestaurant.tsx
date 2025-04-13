'use client'

import React from 'react';



export default function InteractiveCardforRes({children,contentName} : {children : React.ReactNode, contentName : string}){
 

    function onCardMouseAction(event: React.SyntheticEvent){
             if(event.type == 'mouseover'){
                event.currentTarget.classList.remove('shadow-lg')
                event.currentTarget.classList.add('shadow-2xl')
                event.currentTarget.classList.add('bg-neutral-200')
             }else{
                event.currentTarget.classList.remove('shadow-2xl')
                event.currentTarget.classList.remove('bg-neutral-200')
                event.currentTarget.classList.add('shadow-lg')
              
            }
        }
        
    
    return (
     
 <div className="w-full h-[300px] bg-yellow-100 rounded-lg shadow-8xl border-4 border-yellow-900" 
 onMouseOver={(e)=>onCardMouseAction(e)}
 onMouseOut={(e)=>onCardMouseAction(e)}>
   
        {children}
      
        </div>
    );
};

