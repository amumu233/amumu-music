import React from 'react';
import Progress from './Progress';

import './MiniPlayer.styl';

class MiniPlayer extends React.Component {
  
  handlePlayOrPause = (e) => {
    e.stopPropagation();
    if(this.props.song.url){
      this.props.playOrPause();
    }
  }
  handleNext = (e) => {
    e.stopPropagation();
    if(this.props.song.url){
      this.props.next()
    }
  }
  handleShow = () => {
    this.props.song.url && this.props.showMiniPlayer();
  }
  render(){
    let song = this.props.song;
    let playerStyle = {};
    if(this.props.showStatus) playerStyle = {display: 'none'};
    if(!song.img) {song.img = require('@/assets/imgs/music.png');}
    let imgStyle = {};
    if(song.playStatus){
      imgStyle['animationPlayState'] = 'running';
      imgStyle['WebkitAnimationPlayState'] = 'running';
    } else {
      imgStyle['animationPlayState'] = 'paused';
      imgStyle['WebkitAnimationPlayState'] = 'paused';
    }
    let playButtonClass = song.playStatus ? 'icon-pause': 'icon-play';
    return (
      <div className="mini-player" style={playerStyle} onClick={this.handleShow.bind(this)}>
        <div className="player-img rotate" style={imgStyle}>
          <img src={song.img} alt={song.name}/>
        </div>
        <div className="player-center">
          <div className="progress-wrapper">
            <Progress disableButton={true} progress={this.props.progress}></Progress>
          </div>
          <span className="song">{song.name}</span>
          <span className="singer">{song.singer}</span>
        </div>
        <div className="player-right">
          <i className={playButtonClass} onClick={this.handlePlayOrPause}></i>
          <i className="icon-next ml-10" onClick={this.handleNext}></i>
        </div>
        <div className="filter"></div>
      </div>
    )
  }
}

export default MiniPlayer