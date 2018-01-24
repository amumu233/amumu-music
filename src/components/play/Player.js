import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from "react-transition-group";
import Progress from './Progress';
import MiniPlayer from './MiniPlayer';
import { Song, createSong } from "@/model/song";


import './Player.styl';

function getTime(s){
  s = Math.floor(s);
  let m = Math.floor(s/60);
  s =  s - m * 60;
  return m + ':' + formatTime(s);
}
function formatTime(s){
  let timeStr = '00';
  if(s>0 && s<10){
    timeStr = "0" + s; 
  } else {
    timeStr = s;
  }
  return timeStr
}


export default class Player extends React.Component {
  constructor(props){
    super(props);


    this.currentSong = new Song(0, '', '', '', 0, '', '');
    this.currentIndex = 0;

    this.dragProgress = 0;
    this.isFirstPlay = true;
    this.playModes = ["list","single","shuffle"];
    this.state ={
      currentTime: 0,
      playProgress: 0,
      playStatus: false,
      currentPlayMode: 0
    }
  }
  componentDidUpdate() {
		//兼容手机端canplay事件触发后第一次调用play()方法无法自动播放的问题
		if (this.isFirstPlay === true) {
			this.audioDOM.play();
			this.isFirstPlay = false;
		}
	}
  componentDidMount(){
    this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
    this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
    this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
    this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg);

    this.audioDOM.addEventListener('canplay', () => {
      this.audioDOM.play();
      this.startImgRotate();
      this.setState({ playStatus: true});
    }, false);

    this.audioDOM.addEventListener('timeupdate', () => {
      if(this.state.playStatus){
        this.setState({
          playProgress: this.audioDOM.currentTime / this.audioDOM.duration,
          currentTime: this.audioDOM.currentTime
        })
      }
    }, false);

    this.audioDOM.addEventListener('ended', () => {
      let currentIndex = this.currentIndex;
      let playMode = this.state.currentPlayMode;
      let songs = this.props.playSongs;
      let length = songs.length;

      if(length > 1) {
        if(playMode === 0){
          currentIndex = (currentIndex + 1) % length;
        } else if(playMode === 1){
          this.audioDOM.play()
          return;
        } else {
          let index = parseInt(Math.random()*length, 10);
          currentIndex = index;
        }
        this.props.changeCurrentSong(songs[currentIndex]);
        this.props.changeCurrentIndex(currentIndex);
      } else {
        if(playMode === 1) {
          this.audioDOM.play()
        } else {
          this.audioDOM.pause();
          this.stopImgRotate();
          this.setState({
            playProgress: 0,
            currentTime: 0,
            playStatus: false
          })
        }
      }

    }, false);

    this.audioDOM.addEventListener('error', ()=>{
      alert('加载歌曲出错...')
    }, false);
  }
  playOrPause = () => {
    if(!this.state.playStatus){
      if(this.first === undefined){
        this.audioDOM.src = this.currentSong.url;
        this.first = true;
      }
      this.audioDOM.play();
      this.startImgRotate();
      this.setState({playStatus: true});
    } else {
      this.audioDOM.pause();
      this.stopImgRotate();
      this.setState({ playStatus: false})
    }
  }
  previous = () => {
    let songs = this.props.playSongs;
    let length = songs.length;
    let playMode = this.state.currentPlayMode;
    if(length > 0 && length !== 1){
      let currentIndex = this.currentIndex;
      if(playMode === 0 || playMode === 1){
        currentIndex = (currentIndex - 1 + length) % length;
      } else {
        let index = parseInt(Math.random()*length, 10);
        currentIndex = index;
      }
      this.props.changeCurrentSong(songs[currentIndex]);
      this.props.changeCurrentIndex(currentIndex);
    }
  }
  next = () =>{
    let songs = this.props.playSongs;
    let length = songs.length;
    let playMode = this.state.currentPlayMode;
    if(length > 0 && length !== 1){
      let currentIndex = this.currentIndex;
      if(playMode === 0 || playMode === 1){
        currentIndex = (currentIndex + 1) % length;
      } else {
        let index = parseInt(Math.random()*length, 10);
        currentIndex = index;
      }
      this.props.changeCurrentSong(songs[currentIndex]);
      this.props.changeCurrentIndex(currentIndex);
    }
  }
  startImgRotate =() =>{
    if(this.singerImgDOM.className.indexOf('rotate') === -1){
      this.singerImgDOM.classList.add('rotate')
    } else {
      this.singerImgDOM.style['animationPlayState'] = 'running';
      this.singerImgDOM.style['WebkitAnimationPlayState'] = 'running';
    }
  }
  stopImgRotate = () =>{
    this.singerImgDOM.style['animationPlayState'] = 'paused';
    this.singerImgDOM.style['WebkitAnimationPlayState'] = 'paused';
  }
  handleDrag = (progress) =>{
    if(this.audioDOM.duration > 0){
      this.audioDOM.pause();
      this.stopImgRotate();
      this.setState({ playStatus: false});
      this.dragProgress = progress;
    }
  }
  handleDragEnd = () =>{
    if(this.audioDOM.duration > 0){
      let currentTime = this.audioDOM.duration * this.dragProgress;
      this.setState({
        playProgress: this.dragProgress,
        currentTime: currentTime
      }, () => {
        this.audioDOM.currentTime = currentTime;
        this.audioDOM.play();
        this.startImgRotate();
        this.setState({playStatus: true});
        this.dragProgress = 0;
      })
    }
  }
  changePlayMode = () => {
    if(this.state.currentPlayMode === this.playModes.length - 1){
      this.setState({ currentPlayMode: 0})
    } else {
      this.setState({ currentPlayMode: this.state.currentPlayMode + 1})
    }
  }
  showPlayer = () =>{
    this.props.showMusicPlayer(true)
  }
  hidePlayer = () =>{
    this.props.showMusicPlayer(false)
  }
  showPlayList = () =>{
    this.props.showList(true)
  }
  render(){
    this.currentIndex = this.props.currentIndex;

    if(this.props.currentSong && this.props.currentSong.url){
      if(this.currentSong.id !== this.props.currentSong.id){
        let song = this.props.currentSong;
        this.currentSong = this.props.currentSong;
        if(this.audioDOM){
          this.audioDOM.src = this.currentSong.url;
          this.audioDOM.load();
        }
      }
    };
    let song = this.currentSong;
    let playBg = song.img ? song.img : require('@/assets/imgs/play_bg.jpg');
    let playButtonClass = this.state.playStatus ? 'icon-pause' : 'icon-play';
    song.playStatus = this.state.playStatus;
    return (
      <div className="player-container">
        <CSSTransition 
          in={this.props.showStatus} 
          timeout={300} 
          classNames="player-rotate"
          onEnter={() => {
            this.playerDOM.style.display = 'block';
          }}
          onExited={() => {
            this.playerDOM.style.display = 'none'
          }}
          >
          <div className="player" ref="player">
            <div className="header">
              <span className="header-back" onClick={this.hidePlayer}>
                <i className="icon-back"></i>
              </span>
              <div className="header-title">{song.name}</div>
            </div>
            <div className="singer-top">
              <div className="singer">
                <div className="singer-name">{song.singer}</div>
              </div>
            </div>
            <div className="singer-middle">
              <div className="singer-img" ref="singerImg">
                <img src={playBg} alt={song.name} onLoad={(e) => {
                  this.playerBgDOM.style.backgroundImage = `url("${playBg}")`
                }}/>
              </div>
            </div>
            <div className="singer-bottom">
                <div className="controller-wrapper">
                  <div className="progress-wrapper">
                    <span className="currentTime">{getTime(this.state.currentTime)}</span>
                    <div className="play-progress">
                      <Progress
                        progress = {this.state.playProgress}
                        onDrag = {this.handleDrag}
                        onDragEnd = {this.handleDragEnd}
                      ></Progress>
                    </div>
                    <span className="total-time">{getTime(song.duration)}</span>
                  </div>
                  <div className="play-wrapper">
                    <div className="play-mode-button" onClick={this.changePlayMode}>
                      <i className={"icon-"+this.playModes[this.state.currentPlayMode] + '-play'}></i>
                    </div>
                    <div className="previous-button" onClick={this.previous}>
                      <i className="icon-previous"></i>
                    </div>
                    <div className="play-button" onClick={this.playOrPause}>
                      <i className={playButtonClass}></i>
                    </div>
                    <div className="next-button" onClick={this.next}>
                      <i className="icon-next"></i>
                    </div>
                    <div className="play-list-button" onClick={this.showPlayList}>
                      <i className="icon-play-list"></i>
                    </div>
                  </div>
                </div>
            </div>
            <div className="player-bg" ref="playerBg"></div>
            <audio ref="audio"></audio>
          </div>
        </CSSTransition>
        <MiniPlayer
          song={song}
          progress={this.state.playProgress}
          playOrPause={this.playOrPause}
          next={this.next}
          showStatus={this.props.showStatus}
          showMiniPlayer={this.showPlayer}
        ></MiniPlayer>
      </div>
    )
  }
}


