import { connect } from "react-redux";
import Album from '../components/album';
import { showPalyer, changeSong, setSongs } from "../redux/actions";


const mapDiapatchToProps = (dispatch) => ({
  showMusicPlayer: (status) => {
    dispatch(showPalyer(status))
  },
  changeCurrentSong: (song) => {
    dispatch(changeSong(song))
  },
  setSongs: (songs) => {
    dispatch(setSongs(songs))
  }
});

export default connect(
  null,
  mapDiapatchToProps
)(Album);