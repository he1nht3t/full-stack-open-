import React from "react";
import Content from "./Content";
import Header from "./Header";

const Course = ({ courses }) => {
	return (
		<>
			<h1>Web development curriculum</h1>
			{courses.map(course => (
				<div key={course.id}>
					<Header title={course.name} />
					<Content parts={course.parts} />
				</div>
			))}
		</>
	);
};

export default Course;
