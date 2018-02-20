import React from "react"
import PropTypes from "prop-types"
class TogglableText extends React.Component {
  static propTypes = {
    textLabel: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const showWhenVisible = { display: this.state.visible ? "" : "none" }

    return (
      <div>
        <h3 onClick={this.toggleVisibility}>{this.props.textLabel}</h3>

        <div style={showWhenVisible} className="toggledText">
         {this.props.children}
        </div>
      </div>
    )
  }
}

export default TogglableText
