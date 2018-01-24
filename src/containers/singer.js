import { connect } from "react-redux";
import { showPalyer, changeSong, setSongs } from "../redux/actions";
import Singer from '../components/singer/Singer';

const mapDispatchToProps = (dispatch) => ({
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
  mapDispatchToProps
)(Singer);