import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import { getTransitionEndName } from "../../util/event";
import Header from "../../common/header";
import Scroll from "../../common/scroll";
import Loading from "../../common/loading";
import { getRankingInfo } from "../../api/ranking";
import { CODE_SUCCESS } from "../../api/config";
import * as RankingMode from "../../model/ranking";
import * as SongMode from "../../model/song";

import "./RankingInfo.styl";
import { getSongVKey } from "../../api/song";

export default class RankingInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loading: true,
      ranking: {},
      songs: [],
      refreshScroll: false
    };
  }
  componentDidMount(){
    this.setState({show: true})
    let rankingBgDOM = ReactDOM.findDOMNode(this.refs.rankingBg)
    let rankingContainerDOM = ReactDOM.findDOMNode(this.refs.rankingContainer);
    rankingContainerDOM.style.top = rankingBgDOM.offsetHeight + 'px';

    getRankingInfo(this.props.match.params.id).then(res => {
      if(res && res.code === CODE_SUCCESS){
        let ranking = RankingMode.createRankingByDetail(res.topinfo);
        ranking.info = res.topinfo.info;
        let songList = [];
        res.songlist.forEach(item => {
          if(item.data.pay.payplay === 1) {return};
          let song = SongMode.createSong(item.data);
          this.getSongUrl(song, item.data.songmid);
          songList.push(song);
        })
        this.setState({
          loading: false,
          ranking: ranking,
          songs: songList
        }, () => {
          this.setState({refreshScroll: true})
        })
      }
    })
    this.initMusicIco();
  }
  getSongUrl(song,mId){
    getSongVKey(mId).then(res => {
      if(res && res.code === CODE_SUCCESS){
        if(res.data.items){
          let item = res.data.items[0];
          song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;
        }
      }
    })
  }
  initMusicIco = () => {
    this.musicIcos = [];
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco1));
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco2));
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco3));

    this.musicIcos.forEach(item => {
      item.run = false;
      let transitonEndName = getTransitionEndName(item);
      item.addEventListener(transitonEndName, function(){
        this.style.display = 'none';
        this.style['transfrom'] = 'translate3d(0,0,0)';
        this.style['webkitTransfrom'] = 'translate3d(0,0,0)';
        this.run = false;

        let icon = this.querySelector('div');
        icon.style['transfrom'] = 'translate3d(0,0,0)';
        icon.style['webkitTransfrom'] = 'translate3d(0,0,0)';
      }, false)
    });
  }
  startMusicIconAnimation = ({clientX,clientY}) => {
    if(this.musicIcos.length > 0) {
      for (let i = 0; i < this.musicIcos.length; i++) {
        let item = this.musicIcos[i];
        if(!item.run){
          item.style.top = clientY + 'px';
          item.style.left = clientX + 'px';
          item.style.display = 'inline-block';
          setTimeout(() => {
            item.run = true;
            item.style['transform'] = 'translate3d(0,1000px,0)';
            item.style['webkitTransform'] = 'translate3d(0,1000px,0)';
            let icon = item.querySelector('div');
            icon.style['transform'] = 'translate3d(-30px,0,0)';
            icon.style['webkitTransform'] = 'translate3d(-30px,0,0)';
          },10);
          break;
        }
      }
    }
  }
  playAll = () => {
    if(this.state.songs.length > 0){
      this.props.setSongs(this.state.songs);
      this.props.changeCurrentSong(this.state.songs[0]);
      this.props.showMusicPlayer(true);
    }
  }
  selectSong = song => {
    return e => {
      this.props.setSongs([song]);
      this.props.changeCurrentSong(song);
      this.startMusicIconAnimation(e.nativeEvent);
    };
  };
  scroll = ({y}) => {
    let rankingBgDOM = ReactDOM.findDOMNode(this.refs.rankingBg);
    let rankingFixedBgDOM = ReactDOM.findDOMNode(this.refs.rankingFixedBg);
    let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
    if(y<0){
      if(Math.abs(y) + 55 > rankingBgDOM.offsetHeight){
        rankingFixedBgDOM.style.display = 'block';
      } else {
        rankingFixedBgDOM.style.display = 'none';
      }
    }else {
      let transform = `scale(${1+y*0.004},${1+y*0.004})`;
      rankingBgDOM.style['transform'] = transform;
      rankingBgDOM.style['webkitTransform'] = transform;
      playButtonWrapperDOM.style.marginTop = y + 'px';
    }
  }
  render() {
    let ranking = this.state.ranking;
    let songs = this.state.songs.map((song, index) => {
      return (
        <div className="song" key={index} onClick={this.selectSong(song)}>
          <div className="song-index">{index + 1}</div>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="translate">
        <div className="ranking-info">
          <Header title={ranking.title} />
          <div style={{ position: "relative" }}>
            <div
              className="ranking-img"
              ref="rankingBg"
              style={{ backgroundImage: `url(${ranking.img})` }}
            >
              <div className="filter" />
            </div>
            <div
              className="ranking-img fixed"
              ref="rankingFixedBg"
              style={{ backgroundImage: `url(${ranking.img})` }}
            >
              <div className="filter" />
            </div>
            <div className="play-wrapper" ref="playButtonWrapper">
              <div className="play-button" onClick={this.playAll}>
                <i className="icon-play" />
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div className="ranking-container" ref="rankingContainer">
            <div
              className="ranking-scroll"
              style={this.state.loading ? { display: "none" } : {}}
            >
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="ranking-wrapper">
                  <div className="ranking-count">排行榜 共{songs.length}首</div>
                  <div className="song-list">{songs}</div>
                  <div
                    className="info"
                    style={ranking.info ? {} : { display: "none" }}
                  >
                    <h1 className="ranking-title">简介</h1>
                    <div className="ranking-desc">{ranking.info}</div>
                  </div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载" show={this.state.loading} />
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
