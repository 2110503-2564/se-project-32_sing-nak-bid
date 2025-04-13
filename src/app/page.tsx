
import Banner from '@/components/Banner';
import BannerDown from '@/components/Banner_down';
import AdsWeb from '@/components/AdsWeb';

export default function Home() {
  return (
    <main >
      
      <Banner/>

      
<div className='flex items-center justify-center'>
    <AdsWeb/>
    </div>
   
 
    <BannerDown/>
   

    </main>
  );
}
