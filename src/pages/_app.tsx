import { type AppType } from "next/dist/shared/lib/utils"

import "~/styles/globals.css"
import { ThemeProvider } from "../lib/ThemeProvider"
import { api } from "../utils/api"

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ThemeProvider>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default api.withTRPC(MyApp)
