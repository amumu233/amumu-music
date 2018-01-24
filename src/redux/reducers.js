import { combineReducers } from "redux";
import * as types from './actionTypes';
import localStorage from '../util/storage';

const initialState = {
  showStatus: false, // 播放界面是否显示
  song: localStorage.getCurrentSong(), // 当前歌曲(可为空)
  songs: localStorage.getSongs() // 歌曲列表
}

/**
 * 
 * @param {*} showStatus 
 * @param {*} action 
 * 播放界面是否显现
 */
function showStatus(showStatus = initialState.showStatus, action){
  switch(action.type){
    case types.SHOW_PLAYER:
      return action.showStatus;
    default:
      return showStatus;
  }
}

/**
 * 当前歌曲
 * @param {*} song 
 * @param {*} action 
 */
function song(song = initialState.song, action){
  switch(action.type){
    case types.CHANGE_SONG:
      localStorage.setCurrentSong(action.song);
      return action.song;
    default: 
      return song;
  }
}

/**
 * 歌曲列表
 * @param {*} songs 
 * @param {*} action 
 */
function songs(songs = initialState.songs, action){
  switch(action.type){
    case types.SET_SONGS:
      localStorage.setSongs(action.songs);
      return action.songs;
    case types.REMOVE_SONG_FROM_LIST:
      let newSongs = songs.filter(song => song.id !== action.id);
      localStorage.setSongs(newSongs);
      return newSongs;
    default:
      return songs;
  }
}



export default combineReducers({
  showStatus,
  song,
  songs
})