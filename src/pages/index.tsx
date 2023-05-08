import { type NextPage } from "next"
import Head from "next/head"
import Hero from "../components/homepage/Hero"
import Header from "../components/homepage/Header"
import Features from "../components/homepage/Features"
import Form from "../components/homepage/Form"

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Multistream Chat</title>
				<meta name="description" content="The best multistream chat ever" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main className="flex flex-col items-center">
				<Hero />
				<Features />
				<Form />
			</main>
		</>
	)
}

export default Home
