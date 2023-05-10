import { useDispatch } from 'react-redux';
import { filterChange } from '../reducers/filterReducer';

const VisibilityFilter = () => {
	const dispatch = useDispatch();
	return (
		<div>
			<span>
				all{' '}
				<input
					type='radio'
					name='filter'
					onChange={() => dispatch(filterChange('ALL'))}
				/>
			</span>
			<span>
				important{' '}
				<input
					type='radio'
					name='filter'
					onChange={() => dispatch(filterChange('IMPORTANT'))}
				/>
			</span>
			<span>
				nonimportant{' '}
				<input
					type='radio'
					name='filter'
					onChange={() => dispatch(filterChange('NONIMPORTANT'))}
				/>
			</span>
		</div>
	);
};

export default VisibilityFilter;
