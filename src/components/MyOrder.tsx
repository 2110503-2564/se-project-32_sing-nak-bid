'use client'

{/* <div class="w-[250px] bg-white rounded-[10px] border border-silver p-[10px] m-[5px]">
  <!-- content -->
</div> */}

export default function MyOrder() {
    return (
      <div className="p-10 space-y-5">

        {[...Array(20)].map((_, i) => (
          <div key={i} className="w-full bg-white rounded-[10px] border border-gray-300 p-6 text-black shadow">
            Order #{i + 1}
          </div>
        ))}
      </div>
    )
  }