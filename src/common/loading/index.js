import React from 'react';
import './index.styl';
import img from './loading.gif';

export default class Loading extends React.Component {
  render(){
    let displayStyle = this.props.show === true ?
    {display: ''} : { display: 'none'};
    return (
      <div className="loading-container" style={displayStyle}>
        <div className="loading-wrapper">
          <img src={ img } width="18px" height="18px"  alt="正在加载"/>
          <div className="loading-title">{ this.props.title }</div>
        </div>
      </div>
    )
  }
}