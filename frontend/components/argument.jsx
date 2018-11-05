
import React from 'react'

export default class Argument extends React.Component {
	render () {
		const {idea, linkSearch} = this.props;
		return (
			<div>
				<a href={'/vkapp/idea' + linkSearch + '&idea_id=' + idea._id}>{idea.title}</a>
			</div>
		);
	}
}
