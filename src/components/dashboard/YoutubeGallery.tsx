import React, { useEffect, useState } from "react";

interface VideoData {
	thumbnailUrl: string;
	title: string;
	url: string;
}

interface YoutubeGalleryProps {
	urls: string[];
}

interface YoutubeApiResponse {
	thumbnail_url: string;
	title: string;
}

export default function YoutubeGallery({ urls }: YoutubeGalleryProps) {
	const [videos, setVideos] = useState<VideoData[]>([]);

	useEffect(() => {
		async function fetchVideos() {
			try {
				const data = await Promise.all(
					urls.map(async (url) => {
						const response = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);
						const json = await response.json() as YoutubeApiResponse;
						const videoData: VideoData = {
							thumbnailUrl: json.thumbnail_url,
							title: json.title,
							url,
						};
						return videoData;
					})
				);
				setVideos(data);
			} catch (error) {
				console.error(error);
			}
		}
		void fetchVideos();
	}, [urls]);

	return (
		<div className="mt-12 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
			{videos.map((video, key) => (
				<div key={key}>
					<a href={video.url} target="_blank">
						<img className="aspect-[7/4] w-full rounded-xl object-cover" src={video.thumbnailUrl} alt={video.title} />
						<h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-slate-300">{video.title}</h3>
						<p className="text-base leading-7 text-gray-600">Youtube video</p>
					</a>
				</div>
			))}
		</div>
	);
}
