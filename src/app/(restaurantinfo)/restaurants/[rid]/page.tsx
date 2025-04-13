import getRestaurant from "@/libs/getRestaurant";
import Image from "next/image";
import Link from "next/link";
import InteractiveCardforResID from "@/components/InteractiveCardForRID";

export default async function RestaurantDetailPage({params} : {params :{rid :string} }){
   

const restaurantdetail = await getRestaurant(params.rid)
   
    

    return(
      <main className="text-center p-5 bg-center bg-cover items-center justify-center " style={{ backgroundImage: "url('/img/bg2.jpg')" }}>
    
      <InteractiveCardforResID contentName={restaurantdetail.data.name}>
        <div className="border-4 border-neutral-500 rounded-lg ">
      <h1 className="text-5xl font-serif text-yellow-800 my-10 ">
          {restaurantdetail.data.name}
        </h1>
    
        <div className="flex flex-col items-center justify-center my-10">
          <Image
            src={restaurantdetail.data.picture}
            alt="Restaurant Image"
            width={0}
            height={0}
            sizes="100vw"
            className="rounded-lg w-[50%]"
          />
        </div>
    
        <div className="font-sans text-xl text-blue-900">
          <div className="text-md mx-5">Name: {restaurantdetail.data.name}</div>
          <div className="text-md mx-5">Address: {restaurantdetail.data.address}</div>
          <div className="text-md mx-5">District: {restaurantdetail.data.district}</div>
          <div className="text-md mx-5">Province: {restaurantdetail.data.province}</div>
          <div className="text-md mx-5">Tel: {restaurantdetail.data.tel}</div>
          <div className="text-md mx-5">Postal Code: {restaurantdetail.data.postalcode}</div>
          <div className="text-md mx-5">Open Time: {restaurantdetail.data.opentime}</div>
          <div className="text-md mx-5">Close Time: {restaurantdetail.data.closetime}</div>
        </div>

        <Link href={`/reservations?id=${params.rid}&name=${encodeURIComponent(restaurantdetail.data.name)}`}>
        <button
          className="my-6 bg-red-800 border-2 border-red-800 text-white font-semibold py-3 px-4 text-md rounded-full hover:bg-yellow-600 hover:text-white hover:border-yellow-600 transition-all duration-300 ease-in-out font-serif shadow-xl mx-3 text-xl"
        >
          Make a reservation
        </button>
      </Link>
      </div>
      </InteractiveCardforResID>
    
      
      
    </main>
    
    );
}



/*export async function generateStaticParams() {
    return [{cid:"001"},{cid:"002"},{cid:"003"}]
}*/