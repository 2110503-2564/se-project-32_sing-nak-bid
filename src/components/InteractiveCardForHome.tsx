'use client'

import React from 'react';



export default function InteractiveCard({children,contentName} : {children : React.ReactNode, contentName : string}){
 

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
        <div className="flex items-center justify-center">
 <div className="w-[60%] h-[250px] bg-pink-100 rounded-lg shadow-lg mx-24  border-5 border-red-900" 
 onMouseOver={(e)=>onCardMouseAction(e)}
 onMouseOut={(e)=>onCardMouseAction(e)}>
   
        {children}
        </div>
        </div>
    );
};

