import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './styles.css';

export default class Banner extends Component{
  constructor(props){
    super(props);
    this.state= {
      showBanner: false,
      closeAfter: 5,
      closeButton: true
    }

    this.closeBanner = this.closeBanner.bind(this);
    this.resetAfter = this.resetAfter.bind(this);
  }

  componentDidMount() {
    this.setState({showBanner: this.props.showBanner,
                   closeAfter: this.props.closeAfter,
                   closeButton: this.props.closeButton},
                   () => this.resetAfter());
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.showBanner !== this.props.showBanner) {
      this.setState({showBanner: nextProps.showBanner});

      if (nextProps.closeAfter !== this.props.closeAfter) {
        this.setState({closeAfter: nextProps.closeAfter}, () => this.resetAfter());
      } else {
        this.resetAfter();
      }
    }

    if (this.props.closeButton !== nextProps.closeButton) {
      this.setState({closeButton: nextProps.closeButton});
    }
  }

  resetAfter() {
    if(this.state.closeAfter) {
      if(this.state.closeAfter > 0) {
        setTimeout(() => {
          this.setState({showBanner: false});
          if(this.props.callBack) {
            this.props.callBack(false);
          }
        },this.state.closeAfter*1000);
      }
    }
  }

  closeBanner() {
    this.setState({showBanner: false});

    if(this.props.callBack) {
      this.props.callBack(false);
    }
  }

  render() {
    const { status } = this.props;
    const color = (status === 1)?"green":(status === 2)?"orange":(status === 3)?"red":"";

    const showCloseButton = !(this.state.closeButton === false);

    return(
      <div className={`banner ${this.state.showBanner?"block":"none"} ${color}`}>
        {this.props.children}
        <div className={`${showCloseButton?'d_block':'d_none'} bannerButtonClose`} onClick={this.closeBanner}> + </div>
      </div>
    )
  }
}

/*
  status => 0 - info; 1 - green; 2 - warning; 3 - error
*/

Banner.propTypes = {
  status: PropTypes.number,
  showBanner: PropTypes.bool,
  callBack: PropTypes.func,
  closeAfter: PropTypes.number,
  closeButton: PropTypes.bool
}
