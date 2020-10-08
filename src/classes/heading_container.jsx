import React from 'react'
import { headings } from './global_functions';

class HeadingContainer extends React.Component {

    constructor() {
        super();
        this.state = {
            headings : headings().map((heading, i) => <span key = {i} className = {heading.class}>
                    {heading.title}
                </span>)
        }
    }

    render() {
        return (
            <div className = "headingContainer">
                {this.state.headings}        
            </div>
        )
    }
}

export default HeadingContainer