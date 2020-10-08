import React from 'react';
import { links } from '../classes/global_functions'

class Footer extends React.Component {

  constructor() {
    super();
    this.state = {
      links: links().map((x, i) => <a key = {i} href = {x.link}>{x.title}</a>)
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