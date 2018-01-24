import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from "react-transition-group";
import { getTransitionEndName } from "../../util/event";
import Header from '../../common/header';
import Scroll from '../../common/scroll';
import Loading from '../../common/loading';

import { getSongVKey } from "../../api/song";
import { CODE_SUCCESS } from "../../api/config";
import { getSingerInfo } from "../../api/singer";
import * as SongMode from '../../model/song';
import * as SingerMode from '../../model/singer';

import './Singer.styl';

export default class Singer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      show: false,
      loading: true,
      singer: {},
      songs: [],
      refreshScroll: false
    }
  }
  componentDidMount(){
    this.setState({show: true});
    let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
    let albumContainerDOM = ReactDOM.findDOMNode(this.refs.albumContainer);
    albumContainerDOM.style.top = albumBgDOM.offsetHeight + 'px';

    getSingerInfo(this.props.match.params.id).then(res => {
      if(res && res.code === CODE_SUCCESS){
        let singer = SingerMode.createSingerByDetail(res.data);
        singer.desc = res.data.desc;

        let songList = res.data.list;
        let songs = [];
        songList.forEach(item => {
          if(item.musicData.pay.payplay === 1) { return }
          let song = SongMode.createSong(item.musicData);
          this.getSongUrl(song, song.mId);
          songs.push(song);
        });
        this.setState({
          loading: false,
          singer: singer,
          songs: songs
        }, () => {
          this.setState({ refreshScroll: true})
        })
      }
    })
    this.initMusicIco();
  }
  getSongUrl(song, mId) {
		getSongVKey(mId).then((res) => {
			if (res) {
				if(res.code === CODE_SUCCESS) {
					if(res.data.items) {
						let item = res.data.items[0];
						song.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
					}
				}
			}
		});
	}
	/**
	 * 初始化音符图标
	 */
	initMusicIco() {
		this.musicIcos = [];
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco1));
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco2));
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco3));

		this.musicIcos.forEach((item) => {
			//初始化状态
			item.run = false;
			let transitionEndName = getTransitionEndName(item);
			item.addEventListener(transitionEndName, function() {
				this.style.display = "none";
				this.style["webkitTransform"] = "translate3d(0, 0, 0)";
				this.style["transform"] = "translate3d(0, 0, 0)";
				this.run = false;

				let icon = this.querySelector("div");
				icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
				icon.style["transform"] = "translate3d(0, 0, 0)";
			}, false);
		});
	}
	/**
	 * 开始音符下落动画
	 */
	startMusicIcoAnimation({clientX, clientY}) {
		if (this.musicIcos.length > 0) {
			for (let i = 0; i < this.musicIcos.length; i++) {
				let item = this.musicIcos[i];
				//选择一个未在动画中的元素开始动画
				if (item.run === false) {
					item.style.top = clientY + "px";
					item.style.left = clientX + "px";
					item.style.display = "inline-block";
					setTimeout(() => {
						item.run = true;
						item.style["webkitTransform"] = "translate3d(0, 1000px, 0)";
						item.style["transform"] = "translate3d(0, 1000px, 0)";

						let icon = item.querySelector("div");
						icon.style["webkitTransform"] = "translate3d(-30px, 0, 0)";
						icon.style["transform"] = "translate3d(-30px, 0, 0)";
					}, 10);
					break;
				}
			}
		}
	}
	/**
	 * 选择歌曲
	 */
	selectSong(song) {
		return (e) => {
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
			//添加播放歌曲列表
			this.props.setSongs(this.state.songs);
			this.props.changeCurrentSong(this.state.songs[0]);
			this.props.showMusicPlayer(true);
		}
	}
	/**
	 * 监听scroll
	 */
	scroll = ({y}) => {
		let albumBgDOM = ReactDOM.findDOMNode(this.refs.albumBg);
		let albumFixedBgDOM = ReactDOM.findDOMNode(this.refs.albumFixedBg);
		let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
		if (y < 0) {
			if (Math.abs(y) + 55 > albumBgDOM.offsetHeight) {
				albumFixedBgDOM.style.display = "block";
			} else {
				albumFixedBgDOM.style.display = "none";
			}
		} else {
			let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
			albumBgDOM.style["webkitTransform"] = transform;
			albumBgDOM.style["transform"] = transform;
			playButtonWrapperDOM.style.marginTop = `${y}px`;
		}
  }
  
  render(){
    let singer = this.state.singer;
    let songs = this.state.songs.map( (item, index) => {
      return (
        <div className="song" key={item.id} onClick={this.selectSong(item)}>
          <div className="song-name">{item.name}</div>
          <div className="song-singer">{item.singer}</div>
        </div>
      )
    })

    return (
      <CSSTransition in={this.state.show} timeout={300} classNames='translate'>
        <div className="music-singer">
          <Header title={singer.name} ref="header"></Header>
          <div style={{position: 'relative'}}>
            <div className="album-img" ref="albumBg" style={{backgroundImage: `url(${singer.img})`}}>
              <div className="filter"></div>
            </div>
            <div className="album-img fixed" ref="albumFixedBg" style={{backgroundImage: `url(${singer.img})`}}>
              <div className="filter"></div>
            </div>
            <div className="play-wrapper" ref="playButtonWrapper">
              <div className="play-button" onClick={this.playAll}>
                <i className="icon-play"></i>
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div className="album-container" ref="albumContainer">
            <div className="singer-scroll" style={this.state.loading?{display:'none'}:{}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="singer-wrapper">
                  <div className="song-count">歌曲共{songs.length}首</div>
                  <div className="song-list">{songs}</div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载" show={this.state.loading}></Loading>
          </div>
          <div className="music-ico" ref="musicIco1">
            <div className="icon-fe-music"></div>
          </div>
          <div className="music-ico" ref="musicIco2">
            <div className="icon-fe-music"></div>
          </div>
          <div className="music-ico" ref="musicIco3">
            <div className="icon-fe-music"></div>
          </div>
        </div>
      </CSSTransition>
    )
  }
}