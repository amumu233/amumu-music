import React from 'react';
import Player from '../../containers/Player';
import PlayerList from '../../containers/PlayerList';

export default class MusicPlayer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentSongIndex: 0,
      show: false // play list show or hide
    }
    this.changeCurrentIndex = this.changeCurrentIndex.bind(this);
  }
  showList = (status) =>{
    this.setState({ show: status})
  }
  changeCurrentIndex = (index) =>{
    this.setState({ currentSongIndex: index})
  }
  render(){
    return (
      <div className="music-player">
        <Player
          currentIndex={this.state.currentSongIndex}
          showList={this.showList}
          changeCurrentIndex={this.changeCurrentIndex}
        ></Player>
        <PlayerList
          currentIndex={this.state.currentSongIndex}
          showList={this.showList}
          changeCurrentIndex={this.changeCurrentIndex}
          show={this.state.show}
        ></PlayerList>
      </div>
    )
  }
}