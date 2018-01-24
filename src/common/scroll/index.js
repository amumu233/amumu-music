import React from 'react';
import './index.styl';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';


class Scroll extends React.Component {
  
  componentDidUpdate(){
    if( this.bScroll && this.props.refresh === true) {
      this.refresh();
    }
  }
  componentDidMount(){
    this.scrollView = ReactDOM.findDOMNode(this.refs.scrollView);
    if(!this.bScroll){
      this.bScroll = new BScroll(this.scrollView, {
        scrollX: this.props.direction === 'horizontal',
        scrollY: this.props.direction === 'vertical',
        probeType: 3,
        click: this.props.click
      });

      this.props.onScroll && this.bScroll.on("scroll", (scroll) => {
        this.props.onScroll(scroll);
      })
    }
  }
  componentWillUnmount(){
    this.bScroll.off('scroll');
    this.scrollView = null;
  }
  refresh() {
    this.bScroll && this.bScroll.refresh();
  }
  render(){
    return (
      <div className="scroll-view" ref="scrollView">
        { this.props.children }
      </div>
    )
  }
}

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: false,
  onScroll: null
}

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical','horizontal']),
  click: PropTypes.bool,
  refresh: PropTypes.bool,
  onScroll: PropTypes.func
}

export default Scroll;