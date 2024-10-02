"use client"

import { createAssociatedTokenAccountInstruction, createInitializeMint2Instruction, createMintToInstruction, getAssociatedTokenAddressSync, MINT_SIZE, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const wallet = useWallet();
    const { connection } = useConnection();
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [supply, setSupply] = useState('');
    const [uri, setUri] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenMint, setTokenMint] = useState('');
    const [associatedTokenAcc, setAssociatedTokenAcc] = useState('');

    const handleMintToken = async () => {
        try {
            if(!wallet.publicKey) throw new Error("Wallet not connected");
            const mintKeypair = Keypair.generate();
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID
            );

            const mintLen = MINT_SIZE;
            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID
                }),
                createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID
                ),
                createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, BigInt(supply) * BigInt(10 ** 9), [], TOKEN_2022_PROGRAM_ID)
            )

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);
            
            await wallet.sendTransaction(transaction, connection);

            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
            console.log(`Associated Token Address: ${associatedToken.toBase58()}`);
            console.log("Minted!");

            setTokenMint(mintKeypair.publicKey.toBase58());
            setAssociatedTokenAcc(associatedToken.toBase58());
            await setSuccess(true);

        } catch (error) {
            console.error(`Failed to create Token: ${error}`);
            alert('Failed to mint token. Check the console for details.');
        }
    }

    return (
        <div className="flex justify-center items-center h-screen mx-auto">
            <div className="relative flex flex-col justify-center items-start min-h-screengap-8">
                <button
                    onClick={() => router.push('/home')}
                    className="relative bg-blue-500 font-semibold rounded-lg shadow-md hover:bg-blue-600 transition p-2 mb-4"
                >
                    Back to Home
                </button>
                <h1 className="text-3xl font-bold text-blue-400 mb-4">Mint a New Token</h1>
                <div className="w-full max-w-md space-y-4">
                    <input 
                        type="text"
                        placeholder="Token Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    />
                    <input 
                        type="text"
                        placeholder="Token Symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    />
                    <input 
                        type="number"
                        placeholder="Token Supply"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    />
                    <input 
                        type="text"
                        placeholder="Token Uri"
                        value={uri}
                        onChange={(e) => setUri(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                    />
                    <button
                        onClick={handleMintToken}
                        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                    >Create Token</button>
                </div>
                {success === true ? 
                <div>
                    <h1 className="text-4xl font-extrabold text-blue-400 my-6">🎉 Token Minted Successfully!</h1>
                    <h3 className="text-xl font-semibold">Token mint created at:</h3>
                    <p className="text-lg font-mono text-blue-300 break-all">{tokenMint}</p>
                    <h3 className="text-xl font-semibold">Associated Token Address:</h3>
                    <p className="text-lg font-mono text-blue-300 break-all">{associatedTokenAcc}</p>
                    <div className="flex flex-col space-y-2 mt-4">
                        <a
                            href={`https://explorer.solana.com/address/${tokenMint}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            View Mint Token on Solana Explorer
                        </a>
                        <a
                            href={`https://explorer.solana.com/address/${associatedTokenAcc}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            View Associated Token on Solana Explorer
                        </a>
                    </div>
                </div> : null }
            </div>
        </div>
    )
}