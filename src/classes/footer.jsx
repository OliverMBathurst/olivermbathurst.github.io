import React from 'react';
import { links } from '../classes/global'

class Footer extends React.Component {

  constructor() {
    super();
    this.state = {
      links: links().map(x => <a href = {x.Link}>{x.Title}</a>)
    }
  }

  render() {
    return (
      <div className = "footer">
          {this.state.links}
      </div>
    )
  }
}

export default Footer