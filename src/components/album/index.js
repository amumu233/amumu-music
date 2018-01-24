import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { getTransitionEndName } from "../../util/event";
import Header from "../../common/header";
import Scroll from "../../common/scroll";
import Loading from "../../common/loading";

import { getAlbumInfo } from "../../api/recommend";
import { CODE_SUCCESS } from "../../api/config";
import { getSongVKey } from "../../api/song";
import * as AlbumModel from '../../model/album';
import * as SongModel from '../../model/song';

import "./index.styl";

export default class Album extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      loading: true,
      album: {},
      songs: [],
      refreshScroll: false
    };
    this.scroll = this.scroll.bind(this);
  }
  componentDidMount(){ 
    this.setState({show: true});
    let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
    let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
    albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";

    getAlbumInfo(this.props.match.params.id).then(res => {
      if(res && res.code === CODE_SUCCESS){
        let album = AlbumModel.createAlbumByDetail(res.data);
        album.desc = res.data.desc;

        let songList = res.data.list;
        let songs=[];
        songList.forEach(item => {
          let song = SongModel.createSong(item);
          this.getSongUrl(song, item.songmid);
          songs.push(song);
        });
        this.setState({
          loading: false,
          album: album,
          songs: songs
        },() => {
          this.setState({refreshScroll: true})
        })
      }
    })
    this.initMusicIco();
  }
  /**
   * 获取歌曲url
   */
  getSongUrl(song, mId){
    getSongVKey(mId).then(res => {
      if(res && res.code === CODE_SUCCESS){
        if(res.data.items){
          let item = res.data.items[0];
          song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
        }
      }
    })
  }
  /**
   * 初始化 音符图标 以便之后的惭怍
   */
  initMusicIco(){
    this.musicIcos = [];
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco1));
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco2));
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco3));
    
    this.musicIcos.forEach(item => {
      item.run = false;
      let TransitionEndName = getTransitionEndName(item);
      item.addEventListener(TransitionEndName, function(){
        this.style.display = "none";
				this.style["webkitTransform"] = "translate3d(0, 0, 0)";
				this.style["transform"] = "translate3d(0, 0, 0)";
				this.run = false;

				let icon = this.querySelector("div");
				icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
				icon.style["transform"] = "translate3d(0, 0, 0)";
      },false)
    })
  }
  /**
   * 开始图标动画
   */
  startMusicIcoAnimation({clientX,clientY}){
    if(this.musicIcos.length){
      for (let i = 0; i< this.musicIcos.length ;i++){
        let item = this.musicIcos[i];
        if(!item.run){
          item.style.top = clientY + "px";
          item.style.left = clientX + "px";
          item.style.display = 'inline-block';
          setTimeout(() => {
            item.run = true;
						item.style["webkitTransform"] = "translate3d(0, 1000px, 0)";
            item.style["transform"] = "translate3d(0, 1000px, 0)";
            
            let icon = item.querySelector("div");
						icon.style["webkitTransform"] = "translate3d(-30px, 0, 0)";
						icon.style["transform"] = "translate3d(-30px, 0, 0)";
          },10);
          break;
        }
      }
    }
  }
  /**
   * 选择歌曲
   */
  selectSong = (song) => {
    return e => {
      this.props.setSongs([song]);
      this.props.changeCurrentSong(song);
      this.startMusicIcoAnimation(e.nativeEvent);
    };
  }
  /**
   * 播放全部
   */
  playAll = () => {
    if (this.state.songs.length > 0) {
      this.props.setSongs(this.state.songs);
      this.props.changeCurrentSong(this.state.songs[0]);
      this.props.showMusicPlayer(true);
    }
  }
  /**
   * 监测scroll
   */
  scroll = ({y}) => {
    
    let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
    let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg);
    let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
    if( y < 0){
      if (Math.abs(y) + 55 > albumBgDOM.offsetHeight) {
				albumFixedBgDOM.style.display = "block";
			} else {
				albumFixedBgDOM.style.display = "none";
			}
    } else {

      let transform = `scale(${1+y*0.004},${1+y*0.004})`;
      albumBgDOM.style['transform'] = transform; 
      albumBgDOM.style['webkitTransform'] = transform; 
      playButtonWrapperDOM.style.marginTop = y + 'px';
    }
  }
  render() {
    let album = this.state.album;
    let songs = this.state.songs.map(song => {
      return (
        <div className="song" key={song.id} onClick={this.selectSong(song)}>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    return (
      <CSSTransition in={this.state.show} timeout={500} classNames="translate">
        <div className="music-album">
          <Header title={album.name} ref="header" />
          <div style={{ position: "relative" }}>
            <div
              ref="albumBg"
              className="album-img"
              style={{ backgroundImage: `url(${album.img})` }}
            >
              <div className="filter" />
            </div>
            <div
              ref="albumFixedBg"
              className="album-img fixed"
              style={{ backgroundImage: `url(${album.img})` }}
            >
              <div className="filter" />
            </div>
            <div ref="playButtonWrapper" className="play-wrapper">
              <div className="play-button" onClick={this.playAll}>
                <i className="icon-play" />
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref="albumContainer" className="album-container">
            <div
              style={this.state.loading ? { display: "none" } : {}}
              className="album-scroll"
            >
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="album-wrapper">
                  <div className="song-count">专辑共{songs.length}首</div>
                  <div className="song-list">{songs}</div>
                  <div
                    className="album-info"
                    style={album.desc ? {} : { display: "none" }}
                  >
                    <h1 className="album-title">专辑简介</h1>
                    <div className="album-desc">{album.desc}</div>
                  </div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </div>
          <div className="music-ico" ref="musicIco1">
            <div className="icon-fe-music" />
          </div>
          <div className="music-ico" ref="musicIco2">
            <div className="icon-fe-music" />
          </div>
          <div className="music-ico" ref="musicIco3">
            <div className="icon-fe-music" />
          </div>
        </div>
      </CSSTransition>
    );
  }
}
