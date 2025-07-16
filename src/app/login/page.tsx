"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage(){
    const router = useRouter()
    const [email, setEmail] = useState("")

    const handleLogin =async(e: React.FormEvent) =>{
        e.preventDefault()

        //mock login here "actualy" check from DB
        localStorage.setItem("email", email)
        alert("Mock: login link sent to "+ email)
        router.push("/dashboard")
    }
    return(
        <main className="flex flex-col items-center gap-4 mt-10">
            <h1 className="text-2xl font-bold">Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-2">
                <input 
                type="email"
                placeholder="Enter your email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    Send Login Link
                </button>
            </form>
        </main>
    )
}