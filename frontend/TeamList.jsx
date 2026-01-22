import React from 'react';
import Yossi from '../../yossi';
// ...import other members here...

export const members = [
	{ id: 'yossi', Component: Yossi },
	// { id: 'shlomi', Component: Shlomi },
];

export default function TeamList() {
	return (
		<div className="team-list">
			{members.map(({ id, Component }) => (
				<Component key={id} />
			))}
		</div>
	);
}
