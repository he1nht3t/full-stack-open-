import { CoursePart } from '../types';
import { assertNever } from '../utils';

const Part = ({ courseParts }: { courseParts: Array<CoursePart> }) => {
	return (
		<>
			{courseParts.map((coursePart) => {
				switch (coursePart.kind) {
					case 'basic':
						return (
							<div key={coursePart.name}>
								<h3>
									{coursePart.name} - {coursePart.exerciseCount}
								</h3>
								<p>{coursePart.description}</p>
							</div>
						);
					case 'group':
						return (
							<div key={coursePart.name}>
								<h3>
									{coursePart.name} - {coursePart.exerciseCount}
								</h3>
								<p>project exercises - {coursePart.groupProjectCount}</p>
							</div>
						);
					case 'background':
						return (
							<div key={coursePart.name}>
								<h3>
									{coursePart.name} - {coursePart.exerciseCount}
								</h3>
								<div>{coursePart.description}</div>
								<div>{coursePart.backgroundMaterial}</div>
							</div>
						);

					case 'special':
						return (
							<div key={coursePart.name}>
								<h3>
									{coursePart.name} - {coursePart.exerciseCount}
								</h3>
								<div>{coursePart.description}</div>
								<div>required skills: {coursePart.requirements.join(', ')}</div>
							</div>
						);
					default:
						return assertNever(coursePart);
				}
			})}
		</>
	);
};

export default Part;
