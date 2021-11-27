import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class ClickAwayContainer extends Component {
    constructor(props) {
        super(props);
        this.refContainer = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.onBlur);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onBlur);
    }

    onBlur = (event) => {
        if (this.refContainer && !this.refContainer.current.contains(event.target)) {
            this.props.onBlurCallback();
        }
    }

    render() {
        return (<div ref={this.refContainer}>{this.props.children}</div>);
    }
}

ClickAwayContainer.propTypes = {
    children: PropTypes.element.isRequired,
    onBlurCallback: PropTypes.func.isRequired
};