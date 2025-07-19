"use client"
import { useRouter } from "next/navigation";



export default function Home() {
  const router = useRouter()

  const pushTodo= () =>{
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold">CheersDO</h1>
      <p className="py-4">Welcome! What do you want to do today?</p>
      <div className="flex">
        <h2 className="px-2">Create your To-Do list</h2>
        <button className="text-white px-4 bg-green-600 hover:bg-green-700 transition  rounded border-indigo-100 border-2 font-semibold"
          onClick={pushTodo}
        >Go</button>
      </div>
    </div>
  );
}
