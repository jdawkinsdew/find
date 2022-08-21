import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Input from "../components/radix/Input";

const Home: NextPage = () => {
  const [search, setSearch] = useState('')
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      window.open(`https://www.bing.com/search?q=${search}`, '_blank')
    }
  }
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Create <span className="text-purple-300">T3</span> App
        </h1>
        <div className="mb-3 xl:w-96">
          <Input
            type="text"
            className="mt-12 mb-48"
            value={search}
            onChange={setSearch}
            onKeyUp={handleKeyUp}
          />
        </div>
      </main>
    </>
  );
};

export default Home;
