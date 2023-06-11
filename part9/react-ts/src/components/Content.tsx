import { CoursePart } from '../types';
import Part from './Part';

const Content = ({ contents }: { contents: Array<CoursePart> }) => {
	return (
		<>
			<Part courseParts={contents} />
		</>
	);
};

export default Content;
