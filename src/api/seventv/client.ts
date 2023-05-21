import { initContract } from "@ts-rest/core"
import { initQueryClient } from "@ts-rest/react-query"

const c = initContract()

const router = c.router({
	getUserFromTwitchId: c.query({
		method: "GET",
		path: "/users/twitch/:id",
		responses: {
			200: c.response()
		}
	})
})

export const seventvClient = initQueryClient(router, {
	baseUrl: "https://7tv.io/v3",
	baseHeaders: {}
})
