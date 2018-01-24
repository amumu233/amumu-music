import React from 'react';
import { Route } from "react-router-dom";
import LazyLoad, { forceCheck } from 'react-lazyload';
import Scroll from '../../common/scroll';
import Loading from '../../common/loading';
import { getRankingList } from "../../api/ranking";
import { CODE_SUCCESS } from "../../api/config";
import * as RankingMode from '../../model/ranking';
import RankingInfo from '../../containers/Ranking';

import './index.styl';

export default class Ranking extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      loading: true,
      rankingList: [],
      refreshScroll: false
    }
  }

  componentDidMount(){
    getRankingList().then(res => {
      if(res && res.code ===CODE_SUCCESS){
        let topList = [];
        res.data.topList.forEach(item => {
          if(/MV/i.test(item.topTitle)){
            return;
          }
          topList.push(RankingMode.createRankingByList(item))
        });
        this.setState({
          loading: false,
          rankingList: topList
        }, () => {
          this.setState({ refreshScroll: true})
        })
      }
    })
  }

  toDetail = (url) => {
    return () => {
      this.props.history.push({
        pathname: url
      })
    }
  }
  render(){
    let { match } = this.props;
    return (
      <div className="music-ranking">
        <Scroll refresh={this.state.refreshScroll} onScroll={() => { forceCheck() }}>
          <div className="ranking-list">
            {
              this.state.rankingList.map( item => {
                return (
                  <div 
                    className="ranking-wrapper"
                    key={item.id}
                    onClick={this.toDetail(`${match.url + '/' + item.id}`)}
                  >
                    <div className="left">
                      <LazyLoad height={100}>
                        <img src={item.img} alt={item.title}/>
                      </LazyLoad>
                    </div>
                    <div className="right">
                      <h1 className="ranking-title">{item.title}</h1>
                      {
                        item.songs.map((song, index) => {
                          return(
                            <div className="top-song" key={index}>
                              <span className="index">{index+1}</span>
                              <span className="song-name">{song.name}</span>
                              &nbsp; -&nbsp;
                              <span className="song-siner">{song.singer}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Scroll>
        <Loading title="正在加载..." show={this.state.loading}></Loading>
        <Route path={`${match.url + '/:id'}`} component={RankingInfo}></Route>
      </div>
    )
  }
}