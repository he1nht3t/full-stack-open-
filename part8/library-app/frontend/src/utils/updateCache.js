export const updateCache = (cache, query, newObject) => {
	const uniqueByTitle = (arr) => {
		const seen = new Set();
		return arr.filter((el) => {
			const title = el.title;
			return seen.has(title) ? false : seen.add(title);
		});
	};

	cache.updateQuery(query, ({ allBooks }) => {
		return {
			allBooks: uniqueByTitle([...allBooks, newObject]),
		};
	});
};
