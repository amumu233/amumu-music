import * as types from './actionTypes';

export function showPalyer(showStatus){
  return {
    type: types.SHOW_PLAYER,
    showStatus
  }
};

export function changeSong(song){
  return {
    type: types.CHANGE_SONG,
    song
  }
};

export function removeSong(id){
  return {
    type: types.REMOVE_SONG_FROM_LIST,
    id
  }
}

export function setSongs(songs){
  return {
    type: types.SET_SONGS,
    songs
  }
}