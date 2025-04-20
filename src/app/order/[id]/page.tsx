import MyOrder from "@/components/MyOrder"
import ProfileOrder from "@/components/ProfileOrder"


export default function MyOrderPage() {
  return (
    <main className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3">
        <ProfileOrder />
      </div>

      {/* Scrollable content */}
      <div className="w-2/3 overflow-y-scroll h-screen">
        <MyOrder />
      </div>
    </main>
  )
}