import React, { useState, useEffect } from 'react';

type Comment = {
	text: string;
	sentiment: 'positive' | 'negative';
};

const getTwitchComments = async (videoId: string): Promise<Comment[]> => {
	videoId;
	const fakeComments: Comment[] = [
		{ text: 'Super vidéo sur l\'écologie !', sentiment: 'positive' },
		{ text: 'Je ne suis pas d\'accord avec certains points...', sentiment: 'negative' },
		{ text: 'Très intéressant, merci pour le partage !', sentiment: 'positive' },
		{ text: 'On devrait tous faire attention à l\'environnement.', sentiment: 'positive' },
		{ text: 'Je ne comprends pas pourquoi certains sont contre l\'écologie.', sentiment: 'negative' },
	];

	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(fakeComments);
		}, 1000);
	});
};

type TwitchChatSummaryProps = {
	videoId: string;
};

function TwitchChatSummary({ videoId }: TwitchChatSummaryProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [positiveCount, setPositiveCount] = useState(0);
	const [negativeCount, setNegativeCount] = useState(0);

	useEffect(() => {
		async function fetchComments() {
			const fetchedComments = await getTwitchComments(videoId);
			setComments(fetchedComments);
		}

		void fetchComments();
	}, [videoId]);

	useEffect(() => {
		const positive = comments.filter((comment) => comment.sentiment === 'positive').length;
		const negative = comments.filter((comment) => comment.sentiment === 'negative').length;

		setPositiveCount(positive);
		setNegativeCount(negative);
	}, [comments]);

	return (
		<div className="mx-4 lg:mx-0 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-2">Résumé du tchat Twitch sur l&#39;écologie</h2>
			<div className="grid grid-cols-2 gap-4">
				<div className="bg-white dark:bg-slate-800 dark:text-slate-300 p-4 rounded-lg shadow-md">
					<h3 className="text-xl font-semibold mb-2">Avis positifs</h3>
					<p className="text-lg">{positiveCount}</p>
				</div>
				<div className="bg-white dark:bg-slate-800 dark:text-slate-300 p-4 rounded-lg shadow-md">
					<h3 className="text-xl font-semibold mb-2">Avis négatifs</h3>
					<p className="text-lg">{negativeCount}</p>
				</div>
			</div>
			<div className="mt-4">
				<h3 className="text-xl font-semibold mb-2">Commentaires récents :</h3>
				<ul className="list-disc pl-6">
					{comments.slice(-5).map((comment, index) => (
						<li key={index} className="mb-1 dark:text-slate-300">
							{comment.text}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default TwitchChatSummary;
