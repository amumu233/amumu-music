import React from 'react';
import ReactDOM from 'react-dom';
import Proptypes from 'prop-types';

import './Progress.styl';

class Progress extends React.Component {
  componentDidUpdate(){
    if(!this.progressBarWidth){
      this.progressBarWidth = ReactDOM.findDOMNode(this.refs.progressBar).offsetWidth;
    }
  }
  componentDidMount(){
    let progressBarDOM = ReactDOM.findDOMNode(this.refs.progressBar);
    let progressDOM = ReactDOM.findDOMNode(this.refs.progress);
    let progressBtnDOM = ReactDOM.findDOMNode(this.refs.progressBtn);
    this.progressBarWidth = progressBarDOM.offsetWidth;

    let {disableButton, disableDrag, onDragStart, onDrag, onDragEnd } = this.props;
    if(disableButton!==true && disableDrag!==true){
      let downX = 0, buttonLeft = 0;
      progressBtnDOM.addEventListener('touchstart',(e) => {
        let touch = e.touches[0];
        downX = touch.clientX;
        buttonLeft = parseInt(touch.target.style.left, 10);
        onDragStart && onDragStart();
      });
      progressBtnDOM.addEventListener('touchmove',(e) => {
        e.preventDefault();
        let touch = e.touches[0];
        let diffX = touch.clientX - downX;
        let btnLeft = buttonLeft + diffX;
        if(btnLeft > progressBarDOM.offsetWidth){
          btnLeft = progressBarDOM.offsetWidth
        } else if(btnLeft < 0){
          btnLeft = 0
        }
        touch.target.style.left = btnLeft + 'px';
        progressDOM.style.width = btnLeft / this.progressBarWidth * 100 + '%';
        onDrag && onDrag(btnLeft/this.progressBarWidth);
      });
      progressBtnDOM.addEventListener('touchend',(e) => {
        onDragEnd && onDragEnd();
      })
    }
  }

  render(){
    let { progress, disableButton } = this.props;
    if(!progress) progress = 0;

    let progressButtonOffsetLeft = 0;
    if(this.progressBarWidth){
      progressButtonOffsetLeft = progress * this.progressBarWidth
    }
    return (
      <div className="progress-bar" ref="progressBar">
        <div className="progress-load"></div>
        <div className="progress" ref="progress" style={{width: `${progress * 100}%`}}>
          {
            disableButton ? "" :
            <div className="progress-button" ref="progressBtn" style={{left: progressButtonOffsetLeft}}></div>
          }
        </div>
      </div>
    )
  }
}

Progress.propTypes = {
  progress: Proptypes.number.isRequired,
  disableButton: Proptypes.bool,
  disableDrag: Proptypes.bool,
  onDragStart: Proptypes.func,
  onDrag: Proptypes.func,
  onDragEnd: Proptypes.func
}

export default Progress