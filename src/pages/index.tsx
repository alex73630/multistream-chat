import { type NextPage } from "next"
import Head from "next/head"
import Hero from "../components/form/Hero"
import Header from "../components/form/Header"

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Multistream Chat</title>
				<meta name="description" content="The best multistream chat ever" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main className="flex min-h-screen flex-col items-center">
				<Hero />
			</main>
		</>
	)
}

export default Home
