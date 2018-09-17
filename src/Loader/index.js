import React, {Component} from 'react';
import './styles.css';
import PropTypes from 'prop-types';


export default class Loader extends Component{
  constructor(props){
    super(props);
    this.state = {
      showLoader: false,
      dots: "."
    }

    this.animationLoader = 0;

    this.animateDots = this.animateDots.bind(this);
  }

  componentDidMount() {
    this.setState({showLoader: this.props.showLoader});

    if(this.props.showLoader) {
      this.animateDots();
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.showLoader !== nextProps.showLoader) {
      this.setState({showLoader: nextProps.showLoader});

      if(nextProps.showModal) {
        this.animateDots();
      } else {
        clearInterval(this.animationLoader);
      }
    }
  }

  animateDots() {
    this.animationLoader = setInterval(() => {
      const d = this.state.dots.length;
      this.setState({dots: d===1?"..":d===2?"...":d===3?".":"."});
    },666);
  }

  render(){
    return(
      <div className={`${this.state.showLoader?'d_block':'d_none'} loaderContainer`}>
        <div className="loaderContainerBody">
          {this.props.children}
          <div className="loaderContainerBodyDots">
            {this.state.dots}
          </div>
        </div>
      </div>
    )
  }
}


Loader.propTypes = {
  showLoader: PropTypes.bool
}
