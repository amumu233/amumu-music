import React from 'react';
// NavLink与路由符合时 自动添加类名.active
import { 
  BrowserRouter as Router,
  Route, 
  Switch,
  Redirect,
  NavLink
} from "react-router-dom";

import logo from '../assets/imgs/logo.png';
import '../assets/stylus/font.styl';
import '../assets/stylus/reset.styl';
import './App.styl';

import MusicPlayer from './play/MusicPlayer';
import Recommend from './recommend';
import Ranking from './ranking';
import SingerList from './singer/SingerList';
import Search from '../containers/search';

const test = () => (
  <div>test</div>
)

class App extends React.Component {
  render(){
    return (
      <Router>
        <div className="app">
          <header className="app-header">
            <img src={logo} className="app-logo" alt="logo"/>
            <h1 className="app-title">Music</h1>
          </header>
          <div className="music-tab">
            <div className="tab-item">
              <NavLink to="/recommend" className="nav-link">
                <span>推荐</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/ranking" className="nav-link">
                <span>排行榜</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/singer" className="nav-link">
                <span>歌手</span>
              </NavLink>
            </div>
            <div className="tab-item">
              <NavLink to="/search" className="nav-link">
                <span>搜索</span>
              </NavLink>
            </div>
          </div>
          <div className="music-view">
            <Switch>
              <Route path="/recommend" component={Recommend}></Route>
              <Route path="/ranking" component={Ranking}></Route>
              <Route path="/singer" component={SingerList}></Route>
              <Route path="/search" component={Search}></Route>
              <Redirect from='/' to="/recommend"></Redirect>
              <Route component={Recommend}></Route>
            </Switch>
          </div>
          <MusicPlayer></MusicPlayer>
        </div>
      </Router>
    )
  }
}

export default App


