"use client"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from 'next/link'
import { useRouter } from "next/navigation";


export default function HomePage() {
    const { disconnect } = useWallet();
    const router = useRouter();

   const handleDisconnect = async () => {
    try {
        await disconnect();
        router.push('/');
    } catch (error) {
        console.error(`Failed to disconnect: ${error}`)
    }
   }

    return (
        <div className="relative flex flex-col justify-center items-start min-h-screengap-8">
            <div className="flex justify-center">
                <button
                    onClick={handleDisconnect}
                    className="relative bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 transition p-2 mb-4"
                >
                    Disconnect & Back
                </button>
            </div>
            <h2 className="text-4xl font-bold text-blue-400 mb-4">Home</h2>
            <div className="w-full max-w-md space-y-4">
                <Link 
                    href="/mintTokens" 
                    className="block text-lg font-semibold text-blue-300 hover:text-blue-500 transition px-6 py-2 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700"
                >
                    Mint Tokens
                </Link>
                <p className="text-gray-400 mb-4">Create and mint new tokens on the Solana blockchain.</p>

                <Link 
                    href="/createPool" 
                    className="block text-lg font-semibold text-blue-300 hover:text-blue-500 transition px-6 py-2 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700"
                >
                    Create Pool
                </Link>
                <p className="text-gray-400 mb-4">Create a new AMM liquidity pool on Solana.</p>
            </div>
        </div>
    )
}