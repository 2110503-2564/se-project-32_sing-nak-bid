import Image from "next/image";
import AdsCard from "./AdsCardLeft";
import AdsCardR from "./AdsCardRight";

export default function Adsforuse(){
 return (
    <div>
<div className="mt-24"> <AdsCard restaurantName={"Easy to use"} imgSrc={"/img/easy.jpg"} sentence={"Enjoy an easy-to-use app with a wide selection of restaurants right at your fingertips."}/>
<div className="text-black"> 

</div>
</div>

<div className="mt-24 "> <AdsCardR restaurantName={"Various restaurant"} imgSrc={"/img/various.jpg"} sentence={"With many restaurants to choose from, finding your perfect spot is quick and simple."}/>
<div className="text-black"> 

</div>
</div>

<div className="mt-24"> <AdsCard restaurantName={"Make good Food"} imgSrc={"/img/eating.jpg"} sentence={" Make a reservation in just a few simple steps and get ready for a great meal."}/>
<div className="text-black"> 

</div>
</div>


</div>

 );


}