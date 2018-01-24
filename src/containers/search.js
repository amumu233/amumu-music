import { connect } from "react-redux";
import { changeSong, setSongs, showPalyer } from "../redux/actions";
import Search from '../components/search';

const mapDispatchToProps = (dispatch) => ({
  showMusicPlayer: (status) => {
    dispatch(showPalyer(status))
  },
  changeCurrentSong: (song) => {
    dispatch(changeSong(song))
  },
  setSongs: (songs) => {
    dispatch(showPalyer(songs))
  }
})

export default connect(
  null,
  mapDispatchToProps
)(Search)