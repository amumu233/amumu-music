import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from "react-router-dom";
import { getTransitionEndName } from "../../util/event";
import Scroll from '../../common/scroll';
import Loading from '../../common/loading';
import Album from '../../containers/album';
import Singer from '../../containers/singer';
import { getHotKey, search } from "../../api/search";
import { getSongVKey } from "../../api/song";
import { CODE_SUCCESS } from "../../api/config";
import * as SingerMode from '../../model/singer';
import * as SongMode from '../../model/song';
import * as AlbumMode from '../../model/album';

import './index.styl';

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      hotKey: [],
      singer: {},
      album: {},
      songs: [],
      w: '',
      loading: false
    }
  }
  componentDidMount(){
    getHotKey().then(res => {
      if(res && res.code === CODE_SUCCESS){
        this.setState({
          hotKey: res.data.hotkey
        })
      }
    });
    this.initMusicIco();
  }
  handleInput = (e) => {
    let w = e.currentTarget.value;
    this.setState({
      w: w,
      singer: {},
      songs: [],
      album: {}
    })
  }
  handleSearch = (k) => {
    return () => {
      this.search(k);
    }
  }
  search = (w) => {
    this.setState({w,loading: true});
    search(w).then(res => {
      if(res && res.code === CODE_SUCCESS){
        let zhida = res.data.zhida;
        let type = zhida.type;
        let singer = {};
        let album = {};
        switch(type){
          case 0: //song
           break;
          case 2: // singer
            singer = SingerMode.createSingerBySearch(zhida);
            singer.songnum = zhida.songnum;
            singer.albumnum = zhida.albumnum;
            break;
          case 3: // album
            album = new AlbumMode.createAlbumBySearch(zhida);
            break;
          default:
            break;
        };
        let songs = [];
        res.data.song.list.forEach(item => {
          if(item.pay.payplay === 1) {return};
          songs.push(SongMode.createSong(item))
        });
        this.setState({
          loading: false,
          album: album,
          singer: singer,
          songs: songs
        },() => {
          this.refs.scroll.refresh();
        })
      }
    })
  }
  handleClick = (data, type) => {
    return e => {
      switch(type){
        case 'album':
          this.props.history.push({
            pathname: `${this.props.match.url}/album/${data}`
          });
          break;
        case 'singer':
          this.props.history.push({
            pathname: `${this.props.match.url}/singer/${data}`
          });
          break;
        case 'song':
          let nativeEvent = e.nativeEvent;
          getSongVKey(data.mId).then(res => {
            if(res && res.code === CODE_SUCCESS){
              if(res.data.items){
                let item = res.data.items[0];
                data.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;
                this.props.setSongs([data]);
                this.props.changeCurrentSong(data);
                this.startMusicIcoAnimation(nativeEvent);
              }
            }
          })
          break;
        default: 
          break;
      }
    }
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
  render(){
    let album = this.state.album;
    let singer = this.state.singer;
    return (
      <div className="music-search">
        <div className="search-box-wrapper">
          <div className="search-box">
            <i className="icon-search"></i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="搜索歌曲、歌手、专辑"
              value={this.state.w}
              onChange={this.handleInput}
              onKeyDown={
                (e) => {
                  if(e.keyCode === 13){
                    this.search(e.currentTarget.value);
                  }
                }
              }
              />
          </div>
          <div 
            className="cancel-button" 
            style={{display: this.state.w?'block':'none'}}
            onClick={() =>{ this.setState({
              w: '',
              songs: [],
              singer: {},
              album: {}
            }) }}
            >取消</div>
        </div>
        <div className="search-hot" style={{display: this.state.w?'none':'block'}}>  
          <h1 className="title">热门搜索</h1>
          <div className="hot-list">
            {
              this.state.hotKey.map((item, index) => {
                if(index>10) {return};
                return (
                  <div className="hot-item" key={index} onClick={this.handleSearch(item.k)}>
                    {item.k}
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="search-result" style={{ display:this.state.w?'block':'none'}}>
          <Scroll ref="scroll">
            <div>
              <div 
                className="album-wrapper" 
                style={{display: album.id?'block':'none'}}
                onClick={this.handleClick(album.mId,'album')}
                >
                <div className="left"><img src={album.img} alt={album.name}/></div>
                <div className="right">
                  <div className="song">{album.name}</div>
                  <div className="singer">{album.singer}</div>
                </div>
              </div>
              <div 
                className="singer-wrapper" 
                style={{display: singer.id?'block':'none'}}
                onClick={this.handleClick(singer.mId, 'singer')}
                >
                <div className="left"><img src={singer.img} alt={singer.name}/></div>
                <div className="right">
                  <div className="singer">{singer.name}</div>
                  <div className="info">单曲{singer.songnum}  专辑{singer.albumnum}</div>
                </div>
              </div>
              {
                this.state.songs.map(song => {
                  return (
                    <div 
                      className="song-wrapper" 
                      key={song.id}
                      onClick={this.handleClick(song, 'song')}
                      >
                      <div className="left"><i className="icon-fe-music"></i></div>
                      <div className="right">
                        <div className="song">{song.name}</div>
                        <div className="singer">{song.singer}</div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <Loading title="正在加载..." show={this.state.loading}></Loading>
          </Scroll>
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
        <Route path={`${this.props.match.url + '/album/:id'}`} component={Album}></Route>
        <Route path={`${this.props.match.url + '/singer/:id'}`} component={Singer}></Route>
      </div>
    )
  }
}
export default Search