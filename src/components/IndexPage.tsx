"use client";

import '@solana/wallet-adapter-react-ui/styles.css';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function IndexPage() {
    const { connected, wallet } = useWallet(); 
    const router = useRouter();

    useEffect(() => {
        if (connected) {
            console.log("Wallet connected and ready!");
            router.push('/home');
        } else {
            console.log("wallet not connected");
        }
    }, [connected, wallet, router]);

    return (
        <div className='flex justify-center backdrop-blur-sm bg-white/30'>
            <div className='grid justify-center gap-4 border p-5 rounded-lg'>
                <h1 className='text-4xl font-bold'>Welcome to the <br /> Raydium Launchpad</h1>
                <p className='text-base font-semibold '>Connect your wallet to get started.</p>
                <div className='flex justify-center'>
                    <WalletMultiButton />
                </div>
            </div>
        </div>
    );
}
